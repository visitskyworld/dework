import { useMutation } from "@apollo/client";
import {
  CreateTaskViewInput,
  TaskView,
  CreateTaskViewMutation,
  CreateTaskViewMutationVariables,
  Task,
  TaskViewFilterType,
  TaskViewGroupBy,
  TaskStatus,
  TaskViewSortByField,
  TaskViewSortByDirection,
  UpdateTaskViewInput,
  UpdateTaskViewMutation,
  UpdateTaskViewMutationVariables,
  PaymentStatus,
} from "@dewo/app/graphql/types";
import React, { useCallback, useMemo } from "react";
import {
  createTaskView,
  updateTaskView,
} from "@dewo/app/graphql/mutations/task";
import { useTaskViewContext } from "./TaskViewContext";
import {
  matchingAssigneeIds,
  matchingOwnerIds,
  matchingRoles,
  matchingStatuses,
  matchingTagIds,
} from "./util";
import _ from "lodash";
import { TaskSectionData } from "../board/util";
import { GnosisPayAllButton } from "../board/GnosisPayAllButton";
import { useProject, useProjectDetails } from "../../project/hooks";
import { useOrganizationRoles } from "../../rbac/hooks";

export function useCreateTaskView(): (
  input: CreateTaskViewInput
) => Promise<TaskView> {
  const [mutation] = useMutation<
    CreateTaskViewMutation,
    CreateTaskViewMutationVariables
  >(createTaskView);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.taskView;
    },
    [mutation]
  );
}

export function useUpdateTaskView(): (
  input: UpdateTaskViewInput
) => Promise<TaskView> {
  const [mutation] = useMutation<
    UpdateTaskViewMutation,
    UpdateTaskViewMutationVariables
  >(updateTaskView);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.taskView;
    },
    [mutation]
  );
}

interface TaskViewGroup {
  type: TaskViewGroupBy;
  value: string;
  sections: TaskSectionData[];
}

export function useTaskViewGroups(
  tasks: Task[],
  projectId?: string
): TaskViewGroup[] {
  const { currentView } = useTaskViewContext();
  const sortBys = useMemo(
    () =>
      !!currentView?.sortBys.length
        ? currentView.sortBys
        : [
            {
              field: TaskViewSortByField.sortKey,
              direction: TaskViewSortByDirection.ASC,
            },
          ],
    [currentView?.sortBys]
  );
  const groupBy = currentView?.groupBy ?? TaskViewGroupBy.status;

  const { project } = useProject(projectId);
  const roles = useOrganizationRoles(project?.organizationId);

  const customSortingSections =
    useProjectDetails(projectId).project?.taskSections;

  const findFilter = useCallback(
    (type: TaskViewFilterType) =>
      currentView?.filters.find((f) => f.type === type),
    [currentView]
  );
  const filtered = useMemo(
    () =>
      tasks
        .filter(
          matchingTagIds(
            findFilter(TaskViewFilterType.TAGS)?.tagIds ?? undefined
          )
        )
        .filter(
          matchingAssigneeIds(
            findFilter(TaskViewFilterType.ASSIGNEES)?.assigneeIds ?? undefined
          )
        )
        .filter(
          matchingOwnerIds(
            findFilter(TaskViewFilterType.OWNERS)?.ownerIds ?? undefined
          )
        )
        .filter(
          matchingStatuses(
            findFilter(TaskViewFilterType.STATUSES)?.statuses ?? undefined
          )
        )
        .filter(
          matchingRoles(
            findFilter(TaskViewFilterType.ROLES)?.roleIds ?? undefined,
            roles
          )
        ),
    [tasks, roles, findFilter]
  );

  const groups = useMemo(
    () => _.groupBy(filtered, groupBy),
    [filtered, groupBy]
  );
  const sorted = useMemo(
    () =>
      _.mapValues(groups, (tasks) =>
        _.orderBy(
          tasks,
          sortBys.map((sortBy) => sortBy.field),
          sortBys.map((sortBy) =>
            sortBy.direction === TaskViewSortByDirection.ASC ? "asc" : "desc"
          )
        )
      ),
    [groups, sortBys]
  );

  const groupValues = useMemo(() => {
    if (groupBy === TaskViewGroupBy.status) {
      const statusFilter = findFilter(TaskViewFilterType.STATUSES);
      return [
        TaskStatus.TODO,
        TaskStatus.IN_PROGRESS,
        TaskStatus.IN_REVIEW,
        TaskStatus.DONE,
      ].filter(
        (s) => !statusFilter?.statuses || statusFilter.statuses?.includes(s)
      );
    }

    return [];
  }, [groupBy, findFilter]);

  return useMemo<TaskViewGroup[]>(
    () =>
      groupValues.map((value) => {
        const tasks = sorted[value] ?? [];

        const sortKeySorting =
          sortBys[0]?.field === TaskViewSortByField.sortKey;

        if (groupBy === TaskViewGroupBy.status && value === TaskStatus.DONE) {
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
            return {
              type: groupBy,
              value,
              sections: [
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
              ],
            };
          }
        } else if (
          groupBy === TaskViewGroupBy.status &&
          sortKeySorting &&
          !!customSortingSections
        ) {
          const customSortingSectionsByStatus = customSortingSections.filter(
            (s) => s.status === value
          );
          const [sectioned, unsectioned] = _.partition(tasks, (t) =>
            customSortingSectionsByStatus.some((s) => s.id === t.sectionId)
          );
          const sections: TaskSectionData[] = [];
          _.sortBy(customSortingSectionsByStatus, (s) => s.sortKey)
            .reverse()
            .forEach((section) =>
              sections.push({
                id: section.id,
                title: section.name,
                section,
                tasks: sectioned.filter((t) => t.sectionId === section.id),
              })
            );
          sections.push({
            id: "default",
            tasks: unsectioned,
            title: "Uncategorized",
          });

          return { type: groupBy, value, sections };
        }

        return {
          type: groupBy,
          value,
          sections: [{ id: "default", tasks, title: "Uncategorized" }],
        };
      }),
    [groupValues, groupBy, sorted, sortBys, projectId, customSortingSections]
  );
}