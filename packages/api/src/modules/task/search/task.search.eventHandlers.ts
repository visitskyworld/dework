import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { EventHandler } from "../../app/eventHandler";
import { TaskCreatedEvent, TaskUpdatedEvent } from "../../task/task.events";
import { TaskSearchService } from "./task.search.service";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class TaskSearchCreatedEventHandler extends EventHandler<TaskCreatedEvent> {
  constructor(private readonly service: TaskSearchService) {
    super();
  }

  async process(event: TaskCreatedEvent) {
    await this.service.index([event.task]);
  }
}

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class TaskSearchUpdatedEventHandler extends EventHandler<TaskUpdatedEvent> {
  constructor(private readonly service: TaskSearchService) {
    super();
  }

  async process(event: TaskUpdatedEvent) {
    await this.service.index([event.task]);
  }
}
