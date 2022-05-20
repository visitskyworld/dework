import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { EventHandler } from "../app/eventHandler";
import {
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from "../task/task.events";

import { AuditLogService } from "./auditLog.service";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class AuditLogTaskCreatedEventHandler extends EventHandler<TaskCreatedEvent> {
  constructor(private readonly service: AuditLogService) {
    super();
  }

  async process(event: TaskCreatedEvent) {
    await this.service.log(undefined, event.task, event.userId);
  }
}

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class AuditLogTaskUpdatedEventHandler extends EventHandler<TaskUpdatedEvent> {
  constructor(private readonly service: AuditLogService) {
    super();
  }

  async process(event: TaskUpdatedEvent) {
    await this.service.log(event.prevTask, event.task, event.userId);
  }
}

@Injectable()
@EventsHandler(TaskDeletedEvent)
export class AuditLogTaskDeletedEventHandler extends EventHandler<TaskDeletedEvent> {
  constructor(private readonly service: AuditLogService) {
    super();
  }

  async process(event: TaskDeletedEvent) {
    await this.service.log(event.prevTask, event.task, event.userId);
  }
}
