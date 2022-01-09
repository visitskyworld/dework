import { Task, TaskStatus } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindConditions,
  IsNull,
  Not,
  Repository,
  OrderByCondition,
} from "typeorm";
import { EventBus } from "@nestjs/cqrs";
import { TaskCreatedEvent, TaskUpdatedEvent } from "./task.events";
import { CreateTaskPaymentsInput } from "./dto/CreateTaskPaymentsInput";
import { PaymentService } from "../payment/payment.service";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { ProjectService } from "../project/project.service";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { ProjectVisibility } from "@dewo/api/models/Project";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskReactionInput } from "./dto/TaskReactionInput";

@Injectable()
export class TaskService {
  private readonly logger = new Logger("UserService");

  constructor(
    private readonly eventBus: EventBus,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskReaction)
    private readonly taskReactionRepo: Repository<TaskReaction>,
    @InjectRepository(TaskReward)
    private readonly taskRewardRepo: Repository<TaskReward>,
    private readonly paymentService: PaymentService,
    private readonly projectService: ProjectService,
    @InjectRepository(TaskApplication)
    private readonly taskApplicationRepo: Repository<TaskApplication>
  ) {}

  public async create(
    partial: DeepAtLeast<Task, "projectId" | "name" | "status">
  ): Promise<Task> {
    const created = await this.taskRepo.save({
      ...partial,
      number: await this.getNextTaskNumber(partial.projectId),
      sortKey: Date.now().toString(),
    });
    const refetched = (await this.taskRepo.findOne(created.id)) as Task;
    this.eventBus.publish(new TaskCreatedEvent(refetched));
    return refetched;
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

  public async createTaskApplication(
    partial: DeepAtLeast<TaskApplication, "userId" | "taskId">
  ): Promise<TaskApplication> {
    const task = await this.taskRepo.findOne(partial.taskId);
    if (!task) throw new NotFoundException();

    const applications = await task.applications;
    const existing = applications.find((a) => a.userId === partial.userId);
    if (!!existing) return existing;

    const created = await this.taskApplicationRepo.save(partial);
    return this.taskApplicationRepo.findOne({
      id: created.id,
    }) as Promise<TaskApplication>;
  }

  public async deleteTaskApplication(
    taskId: string,
    userId: string
  ): Promise<Task> {
    await this.taskApplicationRepo.delete({ taskId, userId });
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

    const payment = await this.paymentService.create(
      fromPaymentMethod,
      input.networkId,
      input.data
    );

    const rewards = await this.taskRewardRepo.findByIds(input.taskRewardIds);
    await this.taskRewardRepo.save(
      rewards.map((r) => ({ ...r, payment: undefined, paymentId: payment.id }))
    );

    return this.findWithRelations({ rewardIds: input.taskRewardIds });
  }

  public async createReaction(
    input: TaskReactionInput,
    userId: string
  ): Promise<void> {
    const existing = await this.taskReactionRepo.findOne({ ...input, userId });
    if (!!existing) return;
    await this.taskReactionRepo.save({ ...input, userId });
  }

  public async deleteReaction(
    input: TaskReactionInput,
    userId: string
  ): Promise<void> {
    await this.taskReactionRepo.delete({ ...input, userId });
  }

  public async findById(id: string): Promise<Task | undefined> {
    return this.taskRepo.findOne(id);
  }

  public async findWithRelations({
    ids,
    rewardIds,
    projectIds,
    organizationIds,
    assigneeId,
    statuses,
    limit,
  }: {
    ids?: string[];
    rewardIds?: string[];
    projectIds?: string[];
    organizationIds?: string[];
    assigneeId?: string;
    statuses?: TaskStatus[];
    order?: OrderByCondition;
    limit?: number;
  }): Promise<Task[]> {
    let query = this.taskRepo
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.assignees", "assignee")
      .leftJoinAndSelect("task.tags", "taskTag")
      .leftJoinAndSelect("task.reward", "reward")
      .leftJoinAndSelect("reward.payment", "payment")
      .leftJoinAndSelect("task.review", "review")
      .leftJoinAndSelect("task.reactions", "reactions")
      .leftJoinAndSelect("payment.paymentMethod", "paymentMethod")
      .innerJoinAndSelect("task.project", "project")
      .where("1 = 1");

    if (!!ids) {
      query = query.andWhere("task.id IN (:...ids)", { ids });
    }

    if (!!rewardIds) {
      query = query.andWhere("task.rewardId IN (:...rewardIds)", { rewardIds });
    }

    if (!!projectIds) {
      query = query
        .andWhere("task.projectId IN (:...projectIds)", { projectIds })
        .andWhere("task.parentTaskId IS NULL");
    }

    if (!!organizationIds) {
      query = query
        .andWhere("taskproject.parentTaskId IS NULL")
        .andWhere("project.organizationId IN (:...organizationIds)", {
          organizationIds,
        })
        .andWhere("project.deletedAt IS NULL")
        .andWhere("project.visibility = :public", {
          public: ProjectVisibility.PUBLIC,
        });
    }

    if (!!assigneeId) {
      // TODO(fant): this will filter out other task assignees, which is a bug
      query = query.andWhere("assignee.id = :assigneeId", { assigneeId });
    }

    if (!!statuses) {
      query = query.andWhere("task.status IN (:...statuses)", { statuses });
    }

    return query
      .andWhere("task.deletedAt IS NULL")
      .orderBy("task.createdAt", "DESC")
      .limit(limit)
      .getMany();
  }

  public async count(query: {
    projectId: string;
    status?: TaskStatus;
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

  public async getNextTaskNumber(projectId: string): Promise<number> {
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
