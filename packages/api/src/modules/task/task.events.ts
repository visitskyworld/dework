import { Task } from "@dewo/api/models/Task";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import _ from "lodash";

export class TaskCreatedEvent {
  public readonly diff: Set<keyof Task>;
  public readonly prevTask: undefined;
  constructor(
    public readonly task: Task,
    public readonly userId?: string,
    public readonly sessionId?: string
  ) {
    this.diff = new Set(Object.keys(task) as (keyof Task)[]);
  }
}

export class TaskUpdatedEvent {
  public readonly diff: Set<keyof Task>;
  constructor(
    public readonly task: Task,
    public readonly prevTask: Task,
    public readonly userId?: string,
    public readonly sessionId?: string
  ) {
    this.diff = _.reduce<Task, Set<keyof Task>>(
      task,
      (set, value, key) =>
        _.isEqual(value, prevTask[key as keyof Task])
          ? set
          : set.add(key as keyof Task),
      new Set()
    );
  }
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
