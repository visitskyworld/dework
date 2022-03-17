import { Task, TaskStatus } from "@dewo/api/models/Task";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindConditions,
  IsNull,
  Not,
  Repository,
  OrderByCondition,
  DeepPartial,
  Brackets,
} from "typeorm";
import { EventBus } from "@nestjs/cqrs";
import {
  TaskApplicationCreatedEvent,
  TaskCreatedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "./task.events";
import { CreateTaskPaymentsInput } from "./dto/CreateTaskPaymentsInput";
import { PaymentService } from "../payment/payment.service";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { ProjectService } from "../project/project.service";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskReactionInput } from "./dto/TaskReactionInput";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { UpdateTaskSubmissionInput } from "./dto/UpdateTaskSubmissionInput";
import { TaskSection } from "@dewo/api/models/TaskSection";

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
    private readonly taskApplicationRepo: Repository<TaskApplication>,
    @InjectRepository(TaskSubmission)
    private readonly taskSubmissionRepo: Repository<TaskSubmission>,
    @InjectRepository(TaskSection)
    private readonly taskSectionRepo: Repository<TaskSection>
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
    this.eventBus.publish(new TaskUpdatedEvent(refetched, oldTask));
    return refetched;
  }

  public async createApplication(
    partial: DeepAtLeast<TaskApplication, "userId" | "taskId">
  ): Promise<TaskApplication> {
    const task = await this.taskRepo.findOne(partial.taskId);
    if (!task) throw new NotFoundException();

    const applications = await task.applications;
    const existing = applications.find((a) => a.userId === partial.userId);
    if (!!existing) return existing;

    const created = await this.taskApplicationRepo.save(partial);
    const refetched = (await this.taskApplicationRepo.findOne({
      id: created.id,
    })) as TaskApplication;
    this.eventBus.publish(new TaskApplicationCreatedEvent(task, refetched));
    return refetched;
  }

  public async deleteApplication(
    taskId: string,
    userId: string
  ): Promise<Task> {
    await this.taskApplicationRepo.delete({ taskId, userId });
    return this.findById(taskId) as Promise<Task>;
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
    return this.taskSubmissionRepo.findOne({
      id: existing.id,
    }) as Promise<TaskSubmission>;
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

  public async createSection(
    partial: DeepPartial<TaskSection>
  ): Promise<TaskSection> {
    const created = await this.taskSectionRepo.save({
      ...partial,
      sortKey: Date.now().toString(),
    });
    return this.taskSectionRepo.findOne(created.id) as Promise<TaskSection>;
  }

  public async updateSection(
    partial: DeepAtLeast<TaskSection, "id" | "projectId">
  ): Promise<TaskSection> {
    const query = { id: partial.id, projectId: partial.projectId };
    await this.taskSectionRepo.update(query, partial);
    return this.taskSectionRepo.findOne(query) as Promise<TaskSection>;
  }

  public async findById(id: string): Promise<Task | undefined> {
    return this.taskRepo.findOne(id);
  }

  public async findSectionById(id: string): Promise<TaskSection | undefined> {
    return this.taskSectionRepo.findOne(id);
  }

  public async findWithRelations({
    ids,
    rewardIds,
    projectIds,
    assigneeId,
    statuses,
    limit,
    doneAtAfter,
    doneAtBefore,
  }: {
    ids?: string[];
    rewardIds?: string[];
    projectIds?: string[];
    assigneeId?: string | null;
    statuses?: TaskStatus[];
    order?: OrderByCondition;
    doneAtAfter?: Date;
    doneAtBefore?: Date;
    limit?: number;
  }): Promise<Task[]> {
    const filterOutSpam = !projectIds && !assigneeId;

    let query = this.taskRepo
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.assignees", "assignee")
      .leftJoinAndSelect("task.tags", "tag")
      .leftJoinAndSelect("task.reward", "reward")
      .leftJoinAndSelect("reward.payment", "payment")
      .leftJoinAndSelect("payment.paymentMethod", "paymentMethod")
      .leftJoinAndSelect("task.review", "review")
      .leftJoinAndSelect("task.reactions", "reaction")
      .leftJoinAndSelect("task.subtasks", "subtask")
      .leftJoinAndSelect("task.applications", "application")
      .leftJoinAndSelect("task.submissions", "submission")
      .innerJoinAndSelect("task.project", "project");

    // for access, making lots of assumptions (e.g. that VIEW_PROJECTS is enabled for fallback role)
    // which tasks can someone see?
    // 1. tasks where the org's fallback role has VIEW_PROJECTS permission AND the task's project does _not_ have inverted VIEW_PROJECTS permission
    // 2. tasks where the user has a role that has VIEW_PROJECTS permission for the specific project
    /*
      .leftJoin(
        Rule,
        "blockingRule",
        "blockingRule.projectId = task.projectId AND blockingRule.permission = :permission AND blockingRule.inverted IS TRUE",
        { permission: RulePermission.VIEW_PROJECTS }
      )
      .leftJoin(
        "blockingRule.role",
        "blockingRole",
        "blockingRole.fallback IS TRUE"
      )
      .leftJoin(
        Rule,
        "allowingRule",
        "allowingRule.projectId = task.projectId AND allowingRule.permission = :permission AND allowingRule.inverted IS FALSE",
        {
          permission: RulePermission.VIEW_PROJECTS,
        }
      )
      .leftJoin("allowingRule.role", "allowingRole")
      .leftJoin("allowingRole.users", "user", "user.id = :userId", {
        userId: requesterId,
      })
      .where("1 = 1")
      .andWhere(
        new Brackets((qb) =>
          qb
            .where("blockingRule.id IS NULL")
            .orWhere("allowingRule.id IS NOT NULL")
        )
      );
      */

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

    return query
      .andWhere("task.deletedAt IS NULL")
      .andWhere("project.deletedAt IS NULL")
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
