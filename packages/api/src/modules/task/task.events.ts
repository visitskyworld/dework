import { Task } from "@dewo/api/models/Task";

export class TaskUpdatedEvent {
  constructor(public readonly task: Task, public readonly prevTask: Task) {}
}

export class TaskCreatedEvent {
  constructor(public readonly task: Task) {}
}
