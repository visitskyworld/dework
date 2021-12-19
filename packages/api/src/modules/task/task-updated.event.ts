import { Task } from "@dewo/api/models/Task";

export class TaskUpdatedEvent {
  constructor(public readonly newTask: Task, public readonly oldTask: Task) {}
}
