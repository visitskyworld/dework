import { Task, TaskStatus } from "@dewo/api/models/Task";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { formatFixed } from "@ethersproject/bignumber";
import {
  FindConditions,
  IsNull,
  Not,
  Repository,
  OrderByCondition,
  Brackets,
} from "typeorm";
import { EventBus } from "@nestjs/cqrs";
import {
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "./task.events";
import { CreateTaskPaymentsInput } from "./dto/CreateTaskPaymentsInput";
import { PaymentService } from "../payment/payment.service";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { ProjectService } from "../project/project.service";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskReactionInput } from "./dto/TaskReactionInput";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { UpdateTaskSubmissionInput } from "./dto/UpdateTaskSubmissionInput";
import { Rule } from "@dewo/api/models/rbac/Rule";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { PaymentCreatedEvent } from "../payment/payment.events";
import moment from "moment";
import { TaskRewardPayment } from "@dewo/api/models/TaskRewardPayment";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly eventBus: EventBus,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskReaction)
    private readonly taskReactionRepo: Repository<TaskReaction>,
    @InjectRepository(TaskRewardPayment)
    private readonly taskRewardPaymentRepo: Repository<TaskRewardPayment>,
    private readonly paymentService: PaymentService,
    private readonly projectService: ProjectService,
    @InjectRepository(TaskSubmission)
    private readonly taskSubmissionRepo: Repository<TaskSubmission>
  ) {}

  public async create(
    partial: DeepAtLeast<Task, "projectId" | "name" | "status">
  ): Promise<Task> {
    const created = await this.taskRepo.save({
      sortKey: Date.now().toString(),
      doneAt: partial.status === TaskStatus.DONE ? new Date() : null,
      ...partial,
      number: await this.getNextTaskNumber(partial.projectId),
    });
    const refetched = (await this.taskRepo.findOne(created.id)) as Task;
    this.eventBus.publish(new TaskCreatedEvent(refetched, created.creatorId));
    return refetched;
  }

  public async update(
    partial: DeepAtLeast<Task, "id">,
    userId?: string
  ): Promise<Task> {
    const oldTask = await this.taskRepo.findOne({ id: partial.id });
    if (!oldTask) throw new NotFoundException();
    const updated = await this.taskRepo.save({
      ...partial,
      updatedAt: new Date(),
      doneAt: (() => {
        if (partial.status === TaskStatus.DONE) {
          if (oldTask.status !== TaskStatus.DONE) {
            return new Date().toISOString();
          }
          return undefined;
        } else if (!!partial.status) {
          return null;
        }
      })(),
    });

    const refetched = (await this.taskRepo.findOne(updated.id)) as Task;
    if (!oldTask.deletedAt && updated.deletedAt) {
      this.eventBus.publish(new TaskDeletedEvent(refetched, oldTask, userId));
    } else {
      this.eventBus.publish(new TaskUpdatedEvent(refetched, oldTask, userId));
    }
    return refetched;
  }

  public async createSubmission(
    partial: AtLeast<TaskSubmission, "userId" | "taskId" | "content">
  ): Promise<TaskSubmission> {
    const task = await this.taskRepo.findOne(partial.taskId);
    if (!task) throw new NotFoundException();

    const created = await this.taskSubmissionRepo.save(partial);
    const refetched = (await this.taskSubmissionRepo.findOne({
      id: created.id,
    })) as TaskSubmission;
    this.eventBus.publish(new TaskSubmissionCreatedEvent(task, refetched));
    return refetched;
  }

  public async updateSubmission(
    input: UpdateTaskSubmissionInput
  ): Promise<TaskSubmission> {
    const existing = await this.taskSubmissionRepo.findOne({
      userId: input.userId,
      taskId: input.taskId,
      deletedAt: IsNull(),
    });
    if (!existing) throw new NotFoundException();
    await this.taskSubmissionRepo.save({ ...existing, ...input });
    return this.taskSubmissionRepo.findOneOrFail({ id: existing.id });
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

    await this.taskRewardPaymentRepo.save(
      input.payments.map((p) => ({ ...p, paymentId: payment.id }))
    );
    const rewardIds = input.payments.map((p) => p.rewardId);
    const tasks = await this.findWithRelations({ rewardIds });

    this.eventBus.publishAll(
      tasks.map((t) => new PaymentCreatedEvent(payment, t))
    );

    return tasks;
  }

  public async clearPayments(paymentId: string): Promise<Task[]> {
    const payments = await this.taskRewardPaymentRepo.find({ paymentId });
    if (!payments.length) return [];

    await this.taskRewardPaymentRepo.delete({ paymentId });
    return this.findWithRelations({
      rewardIds: payments.map((r) => r.rewardId),
    });
  }

  public async createReaction(
    input: TaskReactionInput,
    userId: string
  ): Promise<void> {
    const existing = await this.taskReactionRepo.findOne({ ...input, userId });
    if (!!existing) return;
    await this.taskReactionRepo.save({ ...input, userId });

    const task = await this.taskRepo.findOne(input.taskId);
    this.eventBus.publish(new TaskUpdatedEvent(task!, task!, userId));
  }

  public async deleteReaction(
    input: TaskReactionInput,
    userId: string
  ): Promise<void> {
    await this.taskReactionRepo.delete({ ...input, userId });
    const task = await this.taskRepo.findOne(input.taskId);
    this.eventBus.publish(new TaskUpdatedEvent(task!, task!, userId));
  }

  public async findById(id: string): Promise<Task | undefined> {
    return this.taskRepo.findOne({ id, deletedAt: IsNull() });
  }

  public async findWithRelations({
    ids,
    rewardIds,
    projectIds,
    userId,
    statuses,
    limit,
    doneAtAfter,
    doneAtBefore,
    rewardNotNull,
    requestingUserId,
    joinProjectOrganization = false,
  }: {
    ids?: string[];
    rewardIds?: string[];
    projectIds?: string[];
    userId?: string | null;
    statuses?: TaskStatus[];
    order?: OrderByCondition;
    doneAtAfter?: Date;
    doneAtBefore?: Date;
    rewardNotNull?: boolean;
    limit?: number;
    requestingUserId?: string;
    joinProjectOrganization?: boolean;
  }): Promise<Task[]> {
    if (ids?.length === 0) return [];
    if (projectIds?.length === 0) return [];

    const filterOutSpam = !projectIds && !userId && !ids && !rewardIds;
    let query = this.taskRepo
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.parentTask", "parentTask")
      .leftJoinAndSelect("task.assignees", "assignee")
      .leftJoinAndSelect("task.owners", "owner")
      .leftJoinAndSelect("task.tags", "tag")
      .leftJoinAndSelect("task.skills", "skill")
      .leftJoinAndSelect("task.reward", "reward")
      .leftJoinAndSelect("reward.payments", "rewardPayment")
      .leftJoinAndSelect("rewardPayment.payment", "payment")
      .leftJoinAndSelect("rewardPayment.user", "user")
      .leftJoinAndSelect("reward.token", "token")
      .leftJoinAndSelect("task.review", "review")
      .leftJoinAndSelect("task.reactions", "reaction")
      .leftJoinAndSelect("task.subtasks", "subtask")
      .innerJoinAndSelect("task.project", "project")
      .where("1 = 1");

    if (joinProjectOrganization) {
      query = query.innerJoinAndSelect("project.organization", "organization");
    }

    if (!!ids) {
      query = query.andWhere("task.id IN (:...ids)", { ids });
    }

    if (!!rewardIds) {
      query = query.andWhere("task.rewardId IN (:...rewardIds)", { rewardIds });
    }

    if (!!statuses) {
      query = query.andWhere("task.status IN (:...statuses)", { statuses });
    }

    if (!!doneAtAfter) {
      query = query.andWhere("task.doneAt >= :doneAtAfter", { doneAtAfter });
    }

    if (!!doneAtBefore) {
      query = query.andWhere("task.doneAt < :doneAtBefore", { doneAtBefore });
    }

    if (filterOutSpam) {
      query = query.andWhere(
        "task.createdAt - project.createdAt > '2 hours'::interval"
      );
    }

    if (rewardNotNull) {
      query = query.andWhere("task.rewardId IS NOT NULL");
    }

    if (!!userId) {
      // TODO(fant): this will filter out other task assignees, which is a bug
      query = query.andWhere(
        new Brackets(
          (qb) =>
            qb
              .where("assignee.id = :userId", { userId })
              .orWhere("owner.id = :userId", { userId })
          // .orWhere("submission.userId = :userId", { userId })
          // .orWhere(
          //   new Brackets((qb) =>
          //     qb
          //       .where("application.userId = :userId", { userId })
          //       .andWhere("task.status = :todo", { todo: TaskStatus.TODO })
          //   )
          // )
        )
      );
    } else if (userId === null) {
      query = query.andWhere("assignee.id IS NULL");
    }

    if (!!projectIds) {
      query = query
        .andWhere("task.projectId IN (:...projectIds)", { projectIds })
        .andWhere(
          new Brackets((qb) => {
            qb.where("task.parentTaskId IS NULL").orWhere(
              new Brackets((qb) => {
                qb.where("task.status = :done", { done: TaskStatus.DONE })
                  .andWhere("task.rewardId IS NOT NULL")
                  .andWhere("assignee.id IS NOT NULL");
              })
            );
          })
        );
    }

    if (
      !projectIds &&
      !ids &&
      !rewardIds &&
      (!userId || userId !== requestingUserId)
    ) {
      query = query
        // .cache(ms.hours(1))
        .leftJoin(
          Rule,
          "rule",
          `rule."projectId" = task."projectId" AND rule.permission = :viewProject AND rule.inverted IS TRUE`,
          { viewProject: RulePermission.VIEW_PROJECTS }
        )
        .andWhere("rule.id IS NULL");
    }

    return query
      .andWhere("task.deletedAt IS NULL")
      .andWhere("project.deletedAt IS NULL")
      .orderBy("task.createdAt", "DESC")
      .limit(limit)
      .getMany();
  }

  public async findOverdueTasks(): Promise<Task[]> {
    const todayDateString = moment().format("YYYY-MM-DD");
    return this.taskRepo
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.assignees", "assignee")
      .leftJoinAndSelect("task.owners", "owner")
      .andWhere("task.status NOT IN (:...statuses)", {
        statuses: [TaskStatus.DONE],
      })
      .andWhere("DATE_TRUNC('day', task.dueDate) = :date", {
        date: todayDateString,
      })
      .andWhere("task.deletedAt IS NULL")
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
    if (!project) {
      throw new NotFoundException(
        `Project not found (cannot create next task number): ${projectId}`
      );
    }
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

  public async formatTaskReward(reward: TaskReward): Promise<string> {
    const token = await reward.token;

    if (reward.peggedToUsd) {
      const usdPegDecimalCount = 6;
      return [
        "$" + formatFixed(reward.amount, usdPegDecimalCount),
        "in",
        token.symbol,
      ].join(" ");
    }

    return [formatFixed(reward.amount, token.exp), token.symbol].join(" ");
  }
}
