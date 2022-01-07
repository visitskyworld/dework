import { Injectable } from "@nestjs/common";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { TaskCreatedEvent } from "../../task/task.events";
import { GithubIntegrationService } from "./github.integration.service";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class GithubIntegrationTaskCreatedEventHandler
  implements IEventHandler<TaskCreatedEvent>
{
  constructor(private readonly integration: GithubIntegrationService) {}

  async handle(event: TaskCreatedEvent) {
    if (process.env.NODE_ENV === "test") return;
    await this.integration.createIssueFromTask(event.task);
  }
}
