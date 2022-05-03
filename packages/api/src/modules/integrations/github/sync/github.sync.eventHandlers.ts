import { EventHandler } from "@dewo/api/modules/app/eventHandler";
import {
  TaskCreatedEvent,
  TaskUpdatedEvent,
} from "@dewo/api/modules/task/task.events";
import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { GithubSyncOutgoingService } from "./github.sync.outgoing";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class GithubSyncTaskCreatedEventHandler extends EventHandler<TaskCreatedEvent> {
  constructor(private readonly service: GithubSyncOutgoingService) {
    super();
  }

  async process(event: TaskCreatedEvent) {
    await this.service.handle(event.task, undefined);
  }
}

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class GithubSyncTaskUpdatedEventHandler extends EventHandler<TaskUpdatedEvent> {
  constructor(private readonly service: GithubSyncOutgoingService) {
    super();
  }

  async process(event: TaskUpdatedEvent) {
    await this.service.handle(event.task, event.prevTask);
  }
}
