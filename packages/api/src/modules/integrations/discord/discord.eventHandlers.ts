import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { EventHandler } from "../../app/eventHandler";
import {
  TaskApplicationCreatedEvent,
  TaskCreatedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "../../task/task.events";
import {
  ProjectIntegrationCreatedEvent,
  ProjectIntegrationUpdatedEvent,
} from "../integration.events";
import { DiscordIntegrationService } from "./discord.integration.service";
import { DiscordStatusboardService } from "./discord.statusboard.service";
import { DiscordTaskApplicationThreadService } from "./discord.taskApplicationChannel";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class DiscordIntegrationTaskCreatedEventHandler extends EventHandler<TaskCreatedEvent> {
  constructor(private readonly integration: DiscordIntegrationService) {
    super();
  }

  async process(event: TaskCreatedEvent) {
    await this.integration.handle(event);
  }
}

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class DiscordIntegrationTaskUpdatedEventHandler extends EventHandler<TaskUpdatedEvent> {
  constructor(private readonly integration: DiscordIntegrationService) {
    super();
  }

  async process(event: TaskUpdatedEvent) {
    await this.integration.handle(event);
  }
}

@Injectable()
@EventsHandler(TaskApplicationCreatedEvent)
export class DiscordIntegrationTaskApplicationCreatedEventHandler extends EventHandler<TaskApplicationCreatedEvent> {
  constructor(
    private readonly integration: DiscordIntegrationService,
    private readonly taskApplicationChannelService: DiscordTaskApplicationThreadService
  ) {
    super();
  }

  async process(event: TaskApplicationCreatedEvent) {
    await Promise.all([
      this.integration.handle(event),
      this.taskApplicationChannelService.createTaskApplicationThread(
        event.application
      ),
    ]);
  }
}

@Injectable()
@EventsHandler(TaskSubmissionCreatedEvent)
export class DiscordIntegrationTaskSubmissionCreatedEventHandler extends EventHandler<TaskSubmissionCreatedEvent> {
  constructor(private readonly integration: DiscordIntegrationService) {
    super();
  }

  async process(event: TaskSubmissionCreatedEvent) {
    await this.integration.handle(event);
  }
}

@Injectable()
@EventsHandler(ProjectIntegrationCreatedEvent)
export class DiscordIntegrationCreatedEventHandler extends EventHandler<ProjectIntegrationCreatedEvent> {
  constructor(private readonly service: DiscordStatusboardService) {
    super();
  }

  async process(event: ProjectIntegrationUpdatedEvent) {
    await this.service.handleIntegrationEvent(event);
  }
}

@Injectable()
@EventsHandler(ProjectIntegrationUpdatedEvent)
export class DiscordIntegrationUpdatedEventHandler extends EventHandler<ProjectIntegrationUpdatedEvent> {
  constructor(private readonly service: DiscordStatusboardService) {
    super();
  }

  async process(event: ProjectIntegrationUpdatedEvent) {
    await this.service.handleIntegrationEvent(event);
  }
}
