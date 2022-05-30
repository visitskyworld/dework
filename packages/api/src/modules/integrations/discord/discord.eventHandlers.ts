import { Task } from "@dewo/api/models/Task";
import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { EventHandler } from "../../app/eventHandler";
import {
  PaymentConfirmedEvent,
  PaymentCreatedEvent,
} from "../../payment/payment.events";
import {
  TaskApplicationCreatedEvent,
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "../../task/task.events";
import {
  ProjectIntegrationCreatedEvent,
  ProjectIntegrationUpdatedEvent,
} from "../integration.events";
import { DiscordIntegrationService } from "./discord.integration.service";
import { DiscordStatusboardService } from "./discord.statusboard.service";

@Injectable()
@EventsHandler(TaskCreatedEvent)
export class DiscordIntegrationTaskCreatedEventHandler extends EventHandler<TaskCreatedEvent> {
  constructor(
    private readonly integration: DiscordIntegrationService,
    private readonly statusBoardService: DiscordStatusboardService
  ) {
    super();
  }

  async process(event: TaskCreatedEvent) {
    await this.integration.handle(event);
    await this.statusBoardService.handle(event);
  }
}

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class DiscordIntegrationTaskUpdatedEventHandler extends EventHandler<TaskUpdatedEvent> {
  constructor(
    private readonly integration: DiscordIntegrationService,
    private readonly statusBoardService: DiscordStatusboardService
  ) {
    super();
  }

  async process(event: TaskUpdatedEvent) {
    await this.integration.handle(event);
    await this.statusBoardService.handle(event);
  }
}

@Injectable()
@EventsHandler(TaskDeletedEvent)
export class DiscordIntegrationTaskDeletedEventHandler extends EventHandler<TaskDeletedEvent> {
  constructor(
    private readonly integration: DiscordIntegrationService,
    private readonly statusBoardService: DiscordStatusboardService
  ) {
    super();
  }

  async process(event: TaskDeletedEvent) {
    await this.integration.handle(event);
    await this.statusBoardService.handle(event);
  }
}

@Injectable()
@EventsHandler(TaskApplicationCreatedEvent)
export class DiscordIntegrationTaskApplicationCreatedEventHandler extends EventHandler<TaskApplicationCreatedEvent> {
  constructor(private readonly integration: DiscordIntegrationService) {
    super();
  }

  async process(event: TaskApplicationCreatedEvent) {
    await this.integration.handle(event);
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
@EventsHandler(PaymentCreatedEvent)
export class DiscordIntegrationPaymentCreatedEventHandler extends EventHandler<PaymentCreatedEvent> {
  constructor(private readonly integration: DiscordIntegrationService) {
    super();
  }

  async process(event: PaymentCreatedEvent) {
    await this.integration.handlePayment(event, event.task);
  }
}

@Injectable()
@EventsHandler(PaymentConfirmedEvent)
export class DiscordIntegrationPaymentConfirmedEventHandler extends EventHandler<PaymentConfirmedEvent> {
  constructor(
    private readonly integration: DiscordIntegrationService,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {
    super();
  }

  async process(event: PaymentConfirmedEvent) {
    const tasks = await this.taskRepo
      .createQueryBuilder("task")
      .innerJoin("task.rewards", "reward")
      .innerJoin("reward.payments", "rewardPayment")
      .innerJoin("rewardPayment.payment", "payment")
      .where("payment.id = :id", { id: event.payment.id })
      .getMany();
    if (!tasks.length) return;
    const tasksWithRelations = await this.taskRepo.find({
      id: In(tasks.map((t) => t.id)),
    });
    for (const task of tasksWithRelations) {
      await this.integration.handlePayment(event, task);
    }
  }
}

@Injectable()
@EventsHandler(ProjectIntegrationCreatedEvent)
export class DiscordIntegrationCreatedEventHandler extends EventHandler<ProjectIntegrationCreatedEvent> {
  constructor(private readonly service: DiscordStatusboardService) {
    super();
  }

  async process(event: ProjectIntegrationUpdatedEvent) {
    await this.service.handle(event);
  }
}

@Injectable()
@EventsHandler(ProjectIntegrationUpdatedEvent)
export class DiscordIntegrationUpdatedEventHandler extends EventHandler<ProjectIntegrationUpdatedEvent> {
  constructor(private readonly service: DiscordStatusboardService) {
    super();
  }

  async process(event: ProjectIntegrationUpdatedEvent) {
    await this.service.handle(event);
  }
}
