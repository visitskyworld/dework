import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { EventHandler } from "../app/eventHandler";
import { TaskUpdatedEvent } from "../task/task.events";
import { NotificationService } from "./notification.service";

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class NotificationTaskUpdatedEventHandler extends EventHandler<TaskUpdatedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }

  async process(event: TaskUpdatedEvent) {
    await this.service.process(event);
  }
}
