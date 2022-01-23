import React, { ReactNode, useMemo } from "react";
import _ from "lodash";
import {
  PaymentMethodType,
  PaymentStatus,
  Task,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { inject } from "between";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { GnosisPayAllButton } from "./GnosisPayAllButton";
import { useProject } from "../../project/hooks";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";

const Between = inject("0123456789");

export interface TaskSection {
  title?: string;
  tasks: Task[];
  hidden?: boolean;
  button?: ReactNode;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "Community Suggestions",
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Done",
};

export function useShouldShowInlinePayButton(task: Task): boolean {
  const canUpdateTask = usePermission("update", "Project");
  const projectId = useParseIdFromSlug("projectSlug");
  const project = useProject(projectId);
  const hasPaymentMethod = useMemo(
    () =>
      !!project?.paymentMethods.some(
        (pm) =>
          pm.type !== PaymentMethodType.GNOSIS_SAFE &&
          pm.networks.some((n) => n.id === task.reward?.token.networkId)
      ),
    [project?.paymentMethods, task.reward?.token.networkId]
  );
  return (
    task.status === TaskStatus.DONE &&
    !!task.assignees.length &&
    !!task.reward &&
    !task.reward.payment &&
    !!canUpdateTask &&
    hasPaymentMethod
  );
}

export function useGroupedTasks(
  tasks: Task[],
  projectId?: string
): Record<TaskStatus, TaskSection[]> {
  const canUpdateTasks = usePermission("update", {
    __typename: "Task",
  } as Task);
  return useMemo(() => {
    return _(tasks)
      .filter((task) => !task.deletedAt)
      .groupBy((task) => task.status)
      .mapValues((tasksWithStatus) =>
        _.sortBy(tasksWithStatus, (task) => task.sortKey)
      )
      .mapValues((tasks, status) => {
        if (status === TaskStatus.TODO) {
          const [assigned, unassigned] = _.partition(
            tasks,
            (task) => !!task.assignees.length
          );
          const [claimed, unclaimed] = _.partition(
            unassigned,
            (task) => !!task.applications.length
          );

          if (canUpdateTasks) {
            if (!!assigned.length || !!claimed.length) {
              return [
                {
                  title: "Open applications",
                  tasks: claimed,
                  hidden: !claimed.length,
                },
                {
                  title: "Assigned",
                  tasks: assigned,
                  hidden: !assigned.length,
                },
                { title: "Unclaimed", tasks: unclaimed },
              ];
            }
          } else {
            if (!!assigned.length) {
              return [
                {
                  title: "Assigned",
                  tasks: assigned,
                  hidden: !assigned.length,
                },
                {
                  title: "Unclaimed",
                  tasks: unassigned,
                  hidden: !unassigned.length,
                },
              ];
            }
          }
        }

        if (status === TaskStatus.DONE && canUpdateTasks) {
          const unpaid: Task[] = [];
          const processing: Task[] = [];
          const paid: Task[] = [];

          tasks.forEach((task) => {
            if (
              !!task.assignees.length &&
              !!task.reward &&
              !task.reward.payment
            ) {
              unpaid.push(task);
            } else if (
              task.reward?.payment?.status === PaymentStatus.PROCESSING
            ) {
              processing.push(task);
            } else {
              paid.push(task);
            }
          });

          if (!!unpaid.length || !!processing.length) {
            return [
              {
                title: "Needs payment",
                tasks: unpaid,
                hidden: !unpaid.length,
                button: !!projectId && (
                  <GnosisPayAllButton
                    taskIds={unpaid.map((t) => t.id)}
                    projectId={projectId}
                  />
                ),
              },
              {
                title: "Processing payment",
                tasks: processing,
                hidden: !processing.length,
              },
              { title: "Paid", tasks: paid },
            ];
          }
        }

        return [{ tasks }];
      })
      .value() as Record<TaskStatus, TaskSection[]>;
  }, [tasks, projectId, canUpdateTasks]);
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
