import _ from "lodash";
import { Task, TaskStatusEnum } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, IsNull, Not, Repository } from "typeorm";
import { User } from "@dewo/api/models/User";
import { EventBus } from "@nestjs/cqrs";
import { TaskUpdatedEvent } from "./task-updated.event";

@Injectable()
export class TaskService {
  // private readonly logger = new Logger("UserService");

  constructor(
    private readonly eventBus: EventBus,

    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
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

    this.eventBus.publish(new TaskUpdatedEvent(updated, oldTask!));

    return this.taskRepo.findOne(updated.id) as Promise<Task>;
  }

  public async claim(taskId: string, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne(taskId);
    if (!task) throw new NotFoundException();
    if (task.assignees.map((a) => a.id).includes(user.id)) return task;
    task.assignees.push(user);
    await this.update(task);
    return this.findById(taskId) as Promise<Task>;
  }

  public async unclaim(taskId: string, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne(taskId);
    if (!task) throw new NotFoundException();
    if (!task.assignees.map((a) => a.id).includes(user.id)) return task;
    task.assignees = task.assignees.filter((a) => a.id !== user.id);
    await this.update(task);
    return this.findById(taskId) as Promise<Task>;
  }

  public async findById(id: string): Promise<Task | undefined> {
    return this.taskRepo.findOne(id);
  }

  public async findWithRelations({
    projectId,
    organizationId,
    assigneeId,
  }: {
    projectId?: string;
    organizationId?: string;
    assigneeId?: string;
  }): Promise<Task[]> {
    let queryBuilder = this.taskRepo
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.assignees", "assignee")
      .leftJoinAndSelect("task.tags", "taskTag")
      .leftJoinAndSelect("task.reward", "reward");

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
    const result = await this.taskRepo
      .createQueryBuilder("task")
      .select("MAX(task.number)", "max")
      .where("task.projectId = :projectId", { projectId })
      .getRawOne();
    return result.max ? result.max + 1 : 1;
  }
}
