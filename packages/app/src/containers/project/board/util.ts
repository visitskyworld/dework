import { useMemo } from "react";
import _ from "lodash";
import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { inject } from "between";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

const Between = inject("0123456789");

export interface TaskSection {
  title?: string;
  tasks: Task[];
}

export const STATUS_LABEL: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.TODO]: "To Do",
  [TaskStatusEnum.IN_PROGRESS]: "In Progress",
  [TaskStatusEnum.IN_REVIEW]: "In Review",
  [TaskStatusEnum.DONE]: "Done",
};

export function useGroupedTasks(
  tasks: Task[]
): Record<TaskStatusEnum, TaskSection[]> {
  const canUpdateTasks = usePermission("update", "Task");
  return useMemo(() => {
    return _(tasks)
      .filter((task) => !task.deletedAt)
      .groupBy((task) => task.status)
      .mapValues((tasksWithStatus) =>
        _.sortBy(tasksWithStatus, (task) => task.sortKey)
      )
      .mapValues((tasks, status) => {
        if (status === TaskStatusEnum.TODO && canUpdateTasks) {
          const [claimed, unclaimed] = _.partition(
            tasks,
            (task) => !!task.assignees.length
          );
          if (!!claimed.length) {
            return [
              { title: "Open claim requests", tasks: claimed },
              { title: "Unclaimed", tasks: unclaimed },
            ];
          }
        }

        return [{ tasks }];
      })
      .value() as Record<TaskStatusEnum, TaskSection[]>;
  }, [tasks, canUpdateTasks]);
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
