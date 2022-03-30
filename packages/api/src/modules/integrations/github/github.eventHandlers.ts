import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { EventHandler } from "../../app/eventHandler";
import { TaskCreatedEvent } from "../../task/task.events";
import { GithubIntegrationService } from "./github.integration.service";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class GithubIntegrationTaskCreatedEventHandler extends EventHandler<TaskCreatedEvent> {
  constructor(private readonly integration: GithubIntegrationService) {
    super();
  }

  async process(event: TaskCreatedEvent) {
    await this.integration.createIssueFromTask(event.task);
  }
}
