import { Task, TaskStatusEnum } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, In, IsNull, Not, Repository } from "typeorm";
import { User } from "@dewo/api/models/User";
import { EventBus } from "@nestjs/cqrs";
import { TaskUpdatedEvent } from "./task-updated.event";
import { CreateTaskPaymentsInput } from "./dto/CreateTaskPaymentsInput";
import { PaymentService } from "../payment/payment.service";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { ProjectService } from "../project/project.service";
import { TaskApplication } from "@dewo/api/models/TaskApplication";

@Injectable()
export class TaskService {
  private readonly logger = new Logger("UserService");

  constructor(
    private readonly eventBus: EventBus,

    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskReward)
    private readonly taskRewardRepo: Repository<TaskReward>,
    private readonly paymentService: PaymentService,
    private readonly projectService: ProjectService,
    @InjectRepository(TaskApplication)
    private readonly taskApplicationRepo: Repository<TaskApplication>
  ) {}

  public async create(
    partial: DeepAtLeast<Task, "projectId" | "name" | "status" | "sortKey">
  ): Promise<Task> {
    const created = await this.taskRepo.save({
      ...partial,
      number: await this.getNextTaskNumber(partial.projectId),
    });
    return this.taskRepo.findOne(created.id) as Promise<Task>;
  }

  public async update(partial: DeepAtLeast<Task, "id">): Promise<Task> {
    const oldTask = await this.taskRepo.findOne({ id: partial.id });
    const updated = await this.taskRepo.save({
      ...partial,
      updatedAt: new Date(),
    });

    const refetched = (await this.taskRepo.findOne(updated.id)) as Task;
    this.eventBus.publish(new TaskUpdatedEvent(refetched, oldTask!));
    return refetched;
  }

  public async claim(
    taskId: string,
    user: User,
    applicationMessage: string
  ): Promise<Task> {
    const task = await this.taskRepo.findOne(taskId);
    if (!task) throw new NotFoundException();

    const taskApplications = await task.taskApplications;
    if (taskApplications.map((a) => a.userId).includes(user.id)) return task;

    const taskApplication = {
      applicationMessage: applicationMessage,
      userId: user.id,
      taskId: taskId,
    };
    await this.taskApplicationRepo.save(taskApplication);
    return this.findById(taskId) as Promise<Task>;
  }

  public async unclaim(taskId: string, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne(taskId);
    if (!task) throw new NotFoundException();
    await this.taskApplicationRepo.delete({ taskId: taskId, userId: user.id });
    return this.findById(taskId) as Promise<Task>;
  }

  public async createPayments(input: CreateTaskPaymentsInput): Promise<Task[]> {
    const fromPaymentMethod = await this.paymentService.findPaymentMethodById(
      input.paymentMethodId
    );
    if (!fromPaymentMethod) {
      const msg = "Payment method not found";
      this.logger.error(`${msg} (${JSON.stringify({ input })})`);
      throw new NotFoundException(msg);
    }

    const payment = await this.paymentService.create({
      paymentMethodId: fromPaymentMethod.id,
      data: input.data,
    });

    await this.taskRewardRepo.update(
      { id: In(input.taskRewardIds) },
      { paymentId: payment.id }
    );

    return this.findWithRelations({ rewardIds: input.taskRewardIds });

    /*
    const task = await this.taskRepo.findOne(input.taskId);
    if (!task) throw new NotFoundException();
    if (!task.rewardId) {
      const msg = "Cannot pay for task without reward";
      this.logger.error(`${msg} (${JSON.stringify(input)})`);
      throw new BadRequestException(msg);
    }

    const assignees = await task.assignees;
    if (!assignees.length) {
      const msg = "Cannot pay for task without assignees";
      this.logger.error(`${msg} (${JSON.stringify(input)})`);
      throw new BadRequestException(msg);
    }

    if (assignees.length > 1) {
      this.logger.warn(
        `Creating task payment for task with multiple assignees. Only first assignee will be paid (${JSON.stringify(
          input
        )})`
      );
    }

    const project = await task.project;
    const fromPaymentMethod = await project.paymentMethod;
    if (!fromPaymentMethod) {
      const msg = "Project is missing payment method";
      this.logger.error(
        `${msg} (${JSON.stringify({ input, projectId: project.id })})`
      );
      throw new BadRequestException(msg);
    }

    const user = assignees[0];
    const toPaymentMethod = await user.paymentMethod;
    if (!toPaymentMethod) {
      const msg = "User is missing payment method";
      this.logger.error(
        `${msg} (${JSON.stringify({ input, userId: user.id })})`
      );
      throw new BadRequestException(msg);
    }

    const payment = await this.paymentService.create({
      from: fromPaymentMethod,
      to: toPaymentMethod,
      txHash: input.txHash,
      data: input.data,
    });

    await this.taskRewardRepo.update(task.rewardId, { paymentId: payment.id });
    return this.findById(task.id) as Promise<Task>;
    */
  }

  public async findById(id: string): Promise<Task | undefined> {
    return this.taskRepo.findOne(id);
  }

  public async findByIds(ids: string[]): Promise<Task[]> {
    return this.taskRepo.find({ id: In(ids) });
  }

  public async findWithRelations({
    rewardIds,
    projectId,
    organizationId,
    assigneeId,
  }: {
    rewardIds?: string[];
    projectId?: string;
    organizationId?: string;
    assigneeId?: string;
  }): Promise<Task[]> {
    let queryBuilder = this.taskRepo
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.assignees", "assignee")
      .leftJoinAndSelect("task.tags", "taskTag")
      .leftJoinAndSelect("task.reward", "reward")
      .leftJoinAndSelect("reward.payment", "payment")
      .leftJoinAndSelect("payment.paymentMethod", "paymentMethod");

    if (!!rewardIds) {
      queryBuilder = queryBuilder.where("task.rewardId IN (:...rewardIds)", {
        rewardIds,
      });
    }

    if (!!projectId) {
      queryBuilder = queryBuilder.where("task.projectId = :projectId", {
        projectId,
      });
    }

    if (!!organizationId) {
      queryBuilder = queryBuilder
        .innerJoinAndSelect("task.project", "project")
        .where("project.organizationId = :organizationId", { organizationId })
        .andWhere("project.deletedAt IS NULL");
    }

    if (!!assigneeId) {
      // TODO(fant): this will filter out other task assignees, which is a bug
      queryBuilder = queryBuilder.where("assignee.id = :assigneeId", {
        assigneeId,
      });
    }

    return queryBuilder.andWhere("task.deletedAt IS NULL").getMany();
  }

  public async count(query: {
    projectId: string;
    status?: TaskStatusEnum;
    rewardNotNull?: boolean;
  }): Promise<number> {
    const findCondition: FindConditions<Task> = {
      projectId: query.projectId,
      deletedAt: IsNull(),
    };
    if (!!query.status) findCondition.status = query.status;
    if (!!query.rewardNotNull) findCondition.rewardId = Not(IsNull());
    return this.taskRepo.count(findCondition);
  }

  private async getNextTaskNumber(projectId: string): Promise<number> {
    const project = await this.projectService.findById(projectId);
    if (!project) throw new NotFoundException();
    const result = await this.taskRepo
      .createQueryBuilder("task")
      .select("MAX(task.number)", "max")
      .innerJoin("task.project", "project")
      .where("project.organizationId = :organizationId", {
        organizationId: project.organizationId,
      })
      .getRawOne();
    return result.max ? result.max + 1 : 1;
  }
}
