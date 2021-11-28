import { useMemo } from "react";
import _ from "lodash";
import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { inject } from "between";

const Between = inject("0123456789");

export const STATUS_LABEL: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.TODO]: "To Do",
  [TaskStatusEnum.IN_PROGRESS]: "In Progress",
  [TaskStatusEnum.IN_REVIEW]: "In Review",
  [TaskStatusEnum.DONE]: "Done",
};

export function useGroupedTasks(tasks: Task[]): Record<TaskStatusEnum, Task[]> {
  return useMemo(() => {
    return _(tasks)
      .groupBy((task) => task.status)
      .mapValues((tasksWithStatus) =>
        _.sortBy(tasksWithStatus, (task) => task.sortKey)
      )
      .value() as Record<TaskStatusEnum, Task[]>;
  }, [tasks]);
}

export function orderBetweenTasks(
  taskAbove: Task | undefined,
  taskBelow: Task | undefined
): string {
  const [a, b] = [
    taskBelow?.sortKey ?? String(Date.now()),
    taskAbove?.sortKey ?? Between.lo,
  ].sort(Between.strord);

  if (a === b) return a;
  return Between.between(a, b);
}
