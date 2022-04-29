import { Task } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventBus } from "@nestjs/cqrs";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskService } from "../task.service";
import { TaskApplicationCreatedEvent } from "../task.events";
import { DiscordTaskApplicationService } from "../../integrations/discord/taskApplication/discord.taskApplication.service";

@Injectable()
export class TaskApplicationService {
  constructor(
    private readonly eventBus: EventBus,
    private readonly taskService: TaskService,
    private readonly discord: DiscordTaskApplicationService,
    @InjectRepository(TaskApplication)
    private readonly repo: Repository<TaskApplication>
  ) {}

  public async create(
    partial: DeepAtLeast<TaskApplication, "userId" | "taskId">
  ): Promise<TaskApplication> {
    const task = await this.taskService.findById(partial.taskId);
    if (!task) throw new NotFoundException();

    const applications = await task.applications;
    const existing = applications.find((a) => a.userId === partial.userId);
    if (!!existing) return existing;

    const created = await this.repo.save(partial);
    const refetched = await this.repo.findOneOrFail({ id: created.id });
    const discordThreadUrl = await this.discord
      .createTaskApplicationThread(refetched, task)
      .catch(() => undefined);

    refetched.discordThreadUrl = discordThreadUrl;
    await this.repo.update({ id: created.id }, { discordThreadUrl });
    this.eventBus.publish(new TaskApplicationCreatedEvent(task, refetched));

    return refetched;
  }

  public async delete(taskId: string, userId: string): Promise<Task> {
    await this.repo.delete({ taskId, userId });
    return this.taskService.findById(taskId) as Promise<Task>;
  }
}
