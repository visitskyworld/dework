import { Task } from "@dewo/api/models/Task";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";

export class TaskCreatedEvent {
  constructor(
    public readonly task: Task,
    public readonly userId?: string,
    public readonly sessionId?: string
  ) {}
}

export class TaskUpdatedEvent {
  constructor(
    public readonly task: Task,
    public readonly prevTask: Task,
    public readonly userId?: string,
    public readonly sessionId?: string
  ) {}
}

export class TaskDeletedEvent {
  constructor(
    public readonly task: Task,
    public readonly prevTask: Task,
    public readonly userId?: string,
    public readonly sessionId?: string
  ) {}
}

export class TaskApplicationCreatedEvent {
  constructor(
    public readonly task: Task,
    public readonly application: TaskApplication
  ) {}
}

export class TaskApplicationDeletedEvent {
  constructor(
    public readonly task: Task,
    public readonly application: TaskApplication
  ) {}
}

export class TaskSubmissionCreatedEvent {
  constructor(
    public readonly task: Task,
    public readonly submission: TaskSubmission
  ) {}
}
