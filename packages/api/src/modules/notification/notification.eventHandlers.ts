import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { EventHandler } from "../app/eventHandler";
import { InviteAcceptedEvent } from "../invite/invite.events";
import {
  PaymentConfirmedEvent,
  PaymentCreatedEvent,
} from "../payment/payment.events";
import {
  TaskApplicationCreatedEvent,
  TaskApplicationDeletedEvent,
  TaskCreatedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "../task/task.events";
import { NotificationService } from "./notification.service";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class NotificationTaskCreatedEventHandler extends EventHandler<TaskCreatedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }

  async process(event: TaskCreatedEvent) {
    await this.service.processTaskCreatedEvent(event);
  }
}

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class NotificationTaskUpdatedEventHandler extends EventHandler<TaskUpdatedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }

  async process(event: TaskUpdatedEvent) {
    await this.service.processTaskUpdatedEvent(event);
  }
}

@Injectable()
@EventsHandler(TaskApplicationCreatedEvent)
export class NotificationTaskApplicationCreatedEventEventHandler extends EventHandler<TaskApplicationCreatedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }
  async process(event: TaskApplicationCreatedEvent) {
    await this.service.processTaskApplicationCreatedEvent(event);
  }
}

@Injectable()
@EventsHandler(TaskApplicationDeletedEvent)
export class NotificationTaskApplicationDeletedEventHandler extends EventHandler<TaskApplicationDeletedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }
  async process(event: TaskApplicationDeletedEvent) {
    await this.service.processTaskApplicationDeletedEvent(event);
  }
}

@Injectable()
@EventsHandler(TaskSubmissionCreatedEvent)
export class NotificationTaskSubmissionCreatedEventHandler extends EventHandler<TaskSubmissionCreatedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }
  async process(event: TaskSubmissionCreatedEvent) {
    await this.service.processTaskSubmissionCreatedEvent(event);
  }
}

@Injectable()
@EventsHandler(PaymentCreatedEvent)
export class NotificationPaymentCreatedEventHandler extends EventHandler<PaymentCreatedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }
  async process(event: PaymentCreatedEvent) {
    await this.service.processPaymentCreatedEvent(event);
  }
}

@Injectable()
@EventsHandler(PaymentConfirmedEvent)
export class NotificationPaymentConfirmedEventHandler extends EventHandler<PaymentConfirmedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }
  async process(event: PaymentConfirmedEvent) {
    await this.service.processPaymentConfirmedEvent(event);
  }
}

@Injectable()
@EventsHandler(InviteAcceptedEvent)
export class NotificationInviteAcceptedEventHandler extends EventHandler<InviteAcceptedEvent> {
  constructor(private readonly service: NotificationService) {
    super();
  }
  async process(event: InviteAcceptedEvent) {
    await this.service.processInviteAcceptedEvent(event);
  }
}
