import { Task } from "@dewo/api/models/Task";
import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventHandler } from "../../app/eventHandler";
import { RuleCreatedEvent, RuleDeletedEvent } from "../../rbac/rbac.events";
import {
  TaskApplicationCreatedEvent,
  TaskApplicationDeletedEvent,
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from "../../task/task.events";
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

@Injectable()
@EventsHandler(TaskDeletedEvent)
export class TaskSearchDeletedEventHandler extends EventHandler<TaskDeletedEvent> {
  constructor(private readonly service: TaskSearchService) {
    super();
  }

  async process(event: TaskDeletedEvent) {
    await this.service.index([event.task]);
  }
}

@Injectable()
@EventsHandler(TaskApplicationCreatedEvent)
export class TaskSearchApplicationCreatedEventHandler extends EventHandler<TaskApplicationCreatedEvent> {
  constructor(private readonly service: TaskSearchService) {
    super();
  }

  async process(event: TaskApplicationCreatedEvent) {
    await this.service.index([event.task]);
  }
}

@Injectable()
@EventsHandler(TaskApplicationDeletedEvent)
export class TaskSearchApplicationDeletedEventHandler extends EventHandler<TaskApplicationDeletedEvent> {
  constructor(private readonly service: TaskSearchService) {
    super();
  }

  async process(event: TaskApplicationDeletedEvent) {
    await this.service.index([event.task]);
  }
}

@Injectable()
@EventsHandler(RuleCreatedEvent)
export class TaskSearchRuleCreatedEventHandler extends EventHandler<RuleCreatedEvent> {
  constructor(
    private readonly service: TaskSearchService,
    @InjectRepository(Task)
    private readonly repo: Repository<Task>
  ) {
    super();
  }

  async process(event: RuleCreatedEvent) {
    if (!!event.rule.taskId) {
      const tasks = await this.repo.find({ id: event.rule.taskId });
      await this.service.index(tasks);
    }

    if (!!event.rule.projectId) {
      const tasks = await this.repo.find({ projectId: event.rule.projectId });
      await this.service.index(tasks);
    }
  }
}

@Injectable()
@EventsHandler(RuleDeletedEvent)
export class TaskSearchRuleDeletedEventHandler extends EventHandler<RuleDeletedEvent> {
  constructor(
    private readonly service: TaskSearchService,
    @InjectRepository(Task)
    private readonly repo: Repository<Task>
  ) {
    super();
  }

  async process(event: RuleDeletedEvent) {
    if (!!event.rule.taskId) {
      const tasks = await this.repo.find({ id: event.rule.taskId });
      await this.service.index(tasks);
    }

    if (!!event.rule.projectId) {
      const tasks = await this.repo.find({ projectId: event.rule.projectId });
      await this.service.index(tasks);
    }
  }
}
