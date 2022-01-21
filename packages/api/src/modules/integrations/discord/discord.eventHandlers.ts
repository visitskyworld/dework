import { Injectable } from "@nestjs/common";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import {
  TaskApplicationCreatedEvent,
  TaskCreatedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "../../task/task.events";
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

@Injectable()
@EventsHandler(TaskApplicationCreatedEvent)
export class DiscordIntegrationTaskApplicationCreatedEventHandler
  implements IEventHandler<TaskApplicationCreatedEvent>
{
  constructor(private readonly integration: DiscordIntegrationService) {}

  async handle(event: TaskApplicationCreatedEvent) {
    if (process.env.NODE_ENV === "test") return;
    await this.integration.handle(event);
  }
}

@Injectable()
@EventsHandler(TaskSubmissionCreatedEvent)
export class DiscordIntegrationTaskSubmissionCreatedEventHandler
  implements IEventHandler<TaskSubmissionCreatedEvent>
{
  constructor(private readonly integration: DiscordIntegrationService) {}

  async handle(event: TaskSubmissionCreatedEvent) {
    if (process.env.NODE_ENV === "test") return;
    await this.integration.handle(event);
  }
}
