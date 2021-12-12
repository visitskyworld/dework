import _ from "lodash";
import { Task, TaskStatusEnum } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, IsNull, Repository } from "typeorm";
import { User } from "@dewo/api/models/User";

@Injectable()
export class TaskService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  public async create(partial: DeepPartial<Task>): Promise<Task> {
    const created = await this.taskRepo.save(partial);
    return this.taskRepo.findOne(created.id) as Promise<Task>;
  }

  public async update(partial: DeepAtLeast<Task, "id">): Promise<Task> {
    const updated = await this.taskRepo.save({
      ...partial,
      updatedAt: new Date(),
    });
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
        .where("project.organizationId = :organizationId", { organizationId });
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
  }): Promise<number> {
    return this.taskRepo.count({
      ..._.omitBy(query, _.isUndefined),
      deletedAt: IsNull(),
    });
  }
}
