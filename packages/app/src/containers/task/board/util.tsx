import { useMemo } from "react";
import _ from "lodash";
import {
  PaymentMethodType,
  Task,
  TaskSection,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { inject } from "between";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useProject } from "../../project/hooks";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";

const Between = inject("0123456789");

export interface TaskGroup {
  id: string;
  tasks: Task[];
  section?: TaskSection;
}

// export interface TaskSection {
//   id: string;
//   title?: string;
//   tasks: Task[];
//   hidden?: boolean;
//   button?: ReactNode;
// }

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
  const { project } = useProject(projectId);
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
  sections?: TaskSection[]
): Record<TaskStatus, TaskGroup[]> {
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
        const sections = sectionsByStatus[status as TaskStatus] ?? [];
        const [sectioned, unsectioned] = _.partition(tasks, (t) =>
          sections.some((s) => s.id === t.sectionId)
        );

        const groups: TaskGroup[] = [];
        _.sortBy(sections, (s) => s.sortKey)
          .reverse()
          .forEach((section) =>
            groups.push({
              section,
              id: section.id,
              tasks: sectioned.filter((t) => t.sectionId === section.id),
            })
          );
        groups.push({ tasks: unsectioned, id: "default" });

        return groups;
      })
      .value() as Record<TaskStatus, TaskGroup[]>;
  }, [tasks, sections]);
}

/*
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
      .mapValues((tasks, status) =>
        status === TaskStatus.DONE
          ? _.sortBy(tasks, (t) => t.doneAt).reverse()
          : _.sortBy(tasks, (t) => t.sortKey)
      )
      .mapValues((tasks, status): TaskSection[] => {
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
                  id: "open-applications",
                  title: "Open applications",
                  tasks: claimed,
                  hidden: !claimed.length,
                },
                {
                  id: "assigned",
                  title: "Assigned",
                  tasks: assigned,
                  hidden: !assigned.length,
                },
                { id: "unclaimed", title: "Unclaimed", tasks: unclaimed },
              ];
            }
          } else {
            if (!!assigned.length) {
              return [
                {
                  id: "assigned",
                  title: "Assigned",
                  tasks: assigned,
                  hidden: !assigned.length,
                },
                {
                  id: "unclaimed",
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
                id: "needs-payment",
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
                id: "processing-payment",
                title: "Processing payment",
                tasks: processing,
                hidden: !processing.length,
              },
              { id: "paid", title: "Paid", tasks: paid },
            ];
          }
        }

        return [{ id: "all", tasks }];
      })
      .value() as Record<TaskStatus, TaskSection[]>;
  }, [tasks, projectId, canUpdateTasks]);
}
*/

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
