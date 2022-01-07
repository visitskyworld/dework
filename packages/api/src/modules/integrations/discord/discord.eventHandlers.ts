import { Injectable } from "@nestjs/common";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { TaskCreatedEvent, TaskUpdatedEvent } from "../../task/task.events";
import { DiscordIntegrationService } from "./discord.integration.service";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class DiscordIntegrationTaskCreatedEventHandler
  implements IEventHandler<TaskCreatedEvent>
{
  constructor(private readonly integration: DiscordIntegrationService) {}

  async handle(event: TaskCreatedEvent) {
    if (process.env.NODE_ENV === "test") return;
    await this.integration.handle(event);
  }
}

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class DiscordIntegrationTaskUpdatedEventHandler
  implements IEventHandler<TaskUpdatedEvent>
{
  constructor(private readonly integration: DiscordIntegrationService) {}

  async handle(event: TaskUpdatedEvent) {
    if (process.env.NODE_ENV === "test") return;
    await this.integration.handle(event);
  }
}
