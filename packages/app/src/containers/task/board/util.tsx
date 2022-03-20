import React, { ReactNode, useMemo } from "react";
import _ from "lodash";
import {
  PaymentMethodType,
  PaymentStatus,
  Task,
  TaskSection,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { inject } from "between";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useProject, useProjectPaymentMethods } from "../../project/hooks";
import { GnosisPayAllButton } from "./GnosisPayAllButton";

const Between = inject("0123456789");

export interface TaskGroup {
  id: string;
  tasks: Task[];
  title: string;
  section?: TaskSection;
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
  const { project } = useProject(task.projectId);
  const paymentMethods = useProjectPaymentMethods(task.projectId);
  const canManageProject = usePermission("update", project);
  const hasPaymentMethod = useMemo(
    () =>
      !!paymentMethods?.some(
        (pm) =>
          pm.type !== PaymentMethodType.GNOSIS_SAFE &&
          pm.networks.some((n) => n.id === task.reward?.token.networkId)
      ),
    [paymentMethods, task.reward?.token.networkId]
  );
  return (
    task.status === TaskStatus.DONE &&
    !!task.assignees.length &&
    !!task.reward &&
    !task.reward.payment &&
    !!canManageProject &&
    hasPaymentMethod
  );
}

export function useGroupedTasks(
  tasks: Task[],
  projectId?: string,
  sections?: TaskSection[]
): Record<TaskStatus, TaskGroup[]> {
  const canUpdateTasks = usePermission("update", {
    __typename: "Task",
  } as Task);

  return useMemo(() => {
    const sectionsByStatus = _.groupBy(
      sections,
      (s) => s.status
    ) as any as Record<TaskStatus, TaskSection[]>;

    const undeletedTasks = tasks.filter((t) => !t.deletedAt);
    const tasksByStatus = Object.assign(
      Object.keys(TaskStatus).reduce(
        (acc, status) => ({ ...acc, [status]: [] }),
        {}
      ),
      _.groupBy(undeletedTasks, (t) => t.status)
    );

    return _(tasksByStatus)
      .mapValues((tasks, status) =>
        status === TaskStatus.DONE
          ? _.sortBy(tasks, (t) => t.doneAt).reverse()
          : _.sortBy(tasks, (t) => t.sortKey)
      )
      .mapValues((tasks, status): TaskGroup[] => {
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
                id: "needs-payment",
                title: "Needs payment",
                tasks: unpaid,
                button: !!projectId && (
                  <GnosisPayAllButton
                    taskIds={unpaid.map((t) => t.id)}
                    projectId={projectId}
                  />
                ),
              },
              {
                id: "processing-payment",
                title: "Processing payment",
                tasks: processing,
              },
              { id: "paid", title: "Paid", tasks: paid },
            ];
          }
        }

        const sections = sectionsByStatus[status as TaskStatus] ?? [];
        const [sectioned, unsectioned] = _.partition(tasks, (t) =>
          sections.some((s) => s.id === t.sectionId)
        );

        const groups: TaskGroup[] = [];
        _.sortBy(sections, (s) => s.sortKey)
          .reverse()
          .forEach((section) =>
            groups.push({
              id: section.id,
              title: section.name,
              section,
              tasks: sectioned.filter((t) => t.sectionId === section.id),
            })
          );
        groups.push({
          id: "default",
          tasks: unsectioned,
          title: "Uncategorized",
        });

        return groups;
      })
      .value() as Record<TaskStatus, TaskGroup[]>;
  }, [tasks, sections, projectId, canUpdateTasks]);
}

export function getSortKeyBetween<T>(
  itemAbove: T | undefined,
  itemBelow: T | undefined,
  getSortKey: (item: T) => string | undefined
): string {
  const [a, b] = [
    !!itemAbove ? getSortKey(itemAbove) ?? Between.lo : Between.lo,
    !!itemBelow
      ? getSortKey(itemBelow) ?? String(Date.now())
      : String(Date.now()),
  ].sort(Between.strord);

  if (a === b) return a;
  return Between.between(a, b);
}
