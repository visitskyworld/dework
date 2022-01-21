import { Task } from "@dewo/api/models/Task";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";

export class TaskUpdatedEvent {
  constructor(public readonly task: Task, public readonly prevTask: Task) {}
}

export class TaskCreatedEvent {
  constructor(public readonly task: Task) {}
}

export class TaskApplicationCreatedEvent {
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
