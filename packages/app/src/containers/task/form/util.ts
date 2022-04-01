import { Task, TaskGatingType } from "@dewo/app/graphql/types";

export function getTaskGatingType(
  task: Task,
  roleIds: string[] | undefined
): TaskGatingType {
  if (!!task?.options?.allowOpenSubmission) {
    return TaskGatingType.OPEN_SUBMISSION;
  }

  if (!!roleIds?.length) {
    return TaskGatingType.ROLES;
  }

  return TaskGatingType.APPLICATION;
}
