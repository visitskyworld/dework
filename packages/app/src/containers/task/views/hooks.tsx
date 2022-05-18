import { useApolloClient, useMutation } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
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
  TaskPriority,
  TaskViewType,
  SearchTasksInput,
  TaskWithOrganization,
  GetPaginatedTasksQuery,
  GetPaginatedTasksQueryVariables,
  PaymentMethod,
  TaskViewField,
} from "@dewo/app/graphql/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createTaskView,
  updateTaskView,
} from "@dewo/app/graphql/mutations/task";
import { useTaskViewContext } from "./TaskViewContext";
import {
  matchingAssigneeIds,
  matchingName,
  matchingOwnerIds,
  matchingPriorities,
  matchingRoles,
  matchingSkillIds,
  matchingStatuses,
  matchingTagIds,
} from "./util";
import _ from "lodash";
import { TaskSectionData } from "../board/util";
import { BatchPayButton } from "../../payment/gnosis/BatchPayButton";
import { useProject, useProjectDetails } from "../../project/hooks";
import { useOrganizationRoles } from "../../rbac/hooks";

const sortByFieldFns: Partial<
  Record<TaskViewSortByField, (task: Task) => string | number>
> = {
  priority: (t) =>
    [
      TaskPriority.URGENT,
      TaskPriority.HIGH,
      TaskPriority.MEDIUM,
      TaskPriority.LOW,
      TaskPriority.NONE,
    ].indexOf(t.priority),
};

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
  projectId?: string,
  paymentMethods?: PaymentMethod[]
): TaskViewGroup[] {
  const { currentView, searchQuery } = useTaskViewContext();
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

  const details = useProjectDetails(projectId).project;
  const customSortingSections = details?.taskSections;

  const findFilter = useCallback(
    (type: TaskViewFilterType) =>
      currentView?.filters.find((f) => f.type === type),
    [currentView]
  );
  const filtered = useMemo(
    () =>
      tasks
        .filter((t) => !t.deletedAt)
        .filter(matchingName(searchQuery))
        .filter(
          matchingTagIds(
            findFilter(TaskViewFilterType.TAGS)?.tagIds ?? undefined
          )
        )
        .filter(
          matchingSkillIds(
            findFilter(TaskViewFilterType.SKILLS)?.skillIds ?? undefined
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
          matchingPriorities(
            findFilter(TaskViewFilterType.PRIORITIES)?.priorities ?? undefined
          )
        )
        .filter(
          matchingRoles(
            findFilter(TaskViewFilterType.ROLES)?.roleIds ?? undefined,
            roles
          )
        ),
    [tasks, roles, searchQuery, findFilter]
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
          sortBys.map((sortBy) => sortByFieldFns[sortBy.field] ?? sortBy.field),
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

      const statuses =
        currentView?.type === TaskViewType.LIST
          ? [
              TaskStatus.IN_REVIEW,
              TaskStatus.IN_PROGRESS,
              TaskStatus.TODO,
              details?.options?.showBacklogColumn && TaskStatus.BACKLOG,
              TaskStatus.DONE,
            ]
          : [
              details?.options?.showBacklogColumn && TaskStatus.BACKLOG,
              TaskStatus.TODO,
              TaskStatus.IN_PROGRESS,
              TaskStatus.IN_REVIEW,
              TaskStatus.DONE,
            ];

      return statuses
        .filter((s): s is TaskStatus => !!s)
        .filter(
          (s) => !statusFilter?.statuses || statusFilter.statuses?.includes(s)
        );
    }

    return [];
  }, [
    groupBy,
    currentView?.type,
    details?.options?.showBacklogColumn,
    findFilter,
  ]);

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
              !!task.reward &&
              !!task.assignees.length &&
              !task.reward?.payments.length
            ) {
              unpaid.push(task);
            } else if (
              task.reward?.payments.some(
                (p) => p.payment.status === PaymentStatus.PROCESSING
              )
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
                  button: !!paymentMethods?.length && (
                    <BatchPayButton
                      taskIds={unpaid.map((t) => t.id)}
                      paymentMethods={paymentMethods}
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
          currentView?.type === TaskViewType.BOARD &&
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
    [
      groupValues,
      sorted,
      sortBys,
      groupBy,
      currentView?.type,
      customSortingSections,
      paymentMethods,
    ]
  );
}

export interface TaskViewLayoutItem {
  value: TaskStatus;
  type: TaskViewGroupBy;
  query: SearchTasksInput;
}

export function useTaskViewLayoutItems() {
  const { currentView, searchQuery } = useTaskViewContext();
  const details = useProjectDetails(
    currentView?.projectId ?? undefined
  ).project;
  return useMemo<TaskViewLayoutItem[]>(() => {
    if (!currentView) return [];
    if (currentView.groupBy === TaskViewGroupBy.status) {
      const filter = (type: TaskViewFilterType) =>
        currentView.filters.find((f) => f.type === type);

      const statusFilter = filter(TaskViewFilterType.STATUSES);
      const statuses =
        currentView.type === TaskViewType.LIST
          ? [
              TaskStatus.IN_REVIEW,
              TaskStatus.IN_PROGRESS,
              TaskStatus.TODO,
              details?.options?.showBacklogColumn && TaskStatus.BACKLOG,
              TaskStatus.DONE,
            ]
          : [
              details?.options?.showBacklogColumn && TaskStatus.BACKLOG,
              TaskStatus.TODO,
              TaskStatus.IN_PROGRESS,
              TaskStatus.IN_REVIEW,
              TaskStatus.DONE,
            ];

      return statuses
        .filter((s): s is TaskStatus => !!s)
        .filter(
          (s) => !statusFilter?.statuses || statusFilter.statuses?.includes(s)
        )
        .map(
          (status): TaskViewLayoutItem => ({
            value: status,
            type: TaskViewGroupBy.status,
            query: {
              organizationId: currentView.organizationId,
              projectIds: !!currentView.projectId
                ? [currentView.projectId]
                : undefined,
              statuses: [status],
              priorities: filter(TaskViewFilterType.PRIORITIES)?.priorities,
              assigneeIds: filter(TaskViewFilterType.ASSIGNEES)?.assigneeIds,
              ownerIds: filter(TaskViewFilterType.OWNERS)?.ownerIds,
              tagIds: filter(TaskViewFilterType.TAGS)?.tagIds,
              roleIds: filter(TaskViewFilterType.ROLES)?.roleIds,
              skillIds: filter(TaskViewFilterType.SKILLS)?.skillIds,
              name: searchQuery,
              applicantIds: filter(TaskViewFilterType.APPLICANTS)?.applicantIds,
              parentTaskId:
                filter(TaskViewFilterType.SUBTASKS)?.subtasks === true
                  ? undefined
                  : null,
              sortBy: {
                field:
                  currentView.sortBys[0]?.field ??
                  TaskViewSortByField.createdAt,
                direction:
                  currentView.sortBys[0]?.direction ??
                  TaskViewSortByDirection.DESC,
              },
            },
          })
        );
    }

    return [];
  }, [currentView, details?.options?.showBacklogColumn, searchQuery]);
}

export interface TaskViewLayoutData {
  tasks?: (Task | TaskWithOrganization)[];
  cursor?: string;
  total?: number;
  hasMore: boolean;
  loading: boolean;
  fetchMore(): void;
}

export function useTaskViewLayoutData(
  filters: SearchTasksInput[],
  options: {
    filter?(task: Task): boolean;
    sort?(a: Task, b: Task): number;
    withOrganization?: boolean;
  } = {}
): TaskViewLayoutData[] {
  const apollo = useApolloClient();

  const [fetchingMore, setFetchingMore] = useState<Record<string, boolean>>({});
  const [forceUpdater, setForceUpdater] = useState(0);
  const forceUpdate = useMemo(
    () => _.debounce(() => setForceUpdater((prev) => prev + 1), 100),
    []
  );

  const observables = useMemo(() => {
    return filters.map((filter) =>
      apollo.watchQuery<
        GetPaginatedTasksQuery,
        GetPaginatedTasksQueryVariables
      >({
        query: options.withOrganization
          ? Queries.paginatedTasksWithOrganization
          : Queries.paginatedTasks,
        variables: { filter },
        fetchPolicy: "cache-first",
      })
    );
  }, [apollo, filters, options.withOrganization]);

  useEffect(() => {
    observables.forEach((o) => o.subscribe(forceUpdate));
  }, [observables, forceUpdate]);

  return useMemo(
    () =>
      observables.map((obs) => {
        const res = obs.getCurrentResult();
        let tasks = res.data?.paginated.tasks ?? undefined;
        if (!!options.filter) tasks = tasks?.filter(options.filter);
        if (!!options.sort) tasks = tasks?.sort(options.sort);
        return {
          tasks,
          cursor: res.data?.paginated.cursor ?? undefined,
          total: res.data?.paginated.total ?? undefined,
          hasMore: !res.data || !!res.data.paginated.cursor,
          loading: res.loading || fetchingMore[obs.queryId],
          fetchMore: async () => {
            if (!!res.data?.paginated.cursor) {
              setFetchingMore((prev) => ({ ...prev, [obs.queryId]: true }));
              return obs
                .fetchMore({ variables: { cursor: res.data.paginated.cursor } })
                .finally(() =>
                  setFetchingMore((prev) => ({ ...prev, [obs.queryId]: false }))
                );
            }
          },
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [observables, forceUpdater, fetchingMore, options.filter]
  );
}

export function useTaskViewFields() {
  const { currentView } = useTaskViewContext();
  return useMemo(
    () =>
      new Set(
        currentView?.fields ?? [
          TaskViewField.gating,
          TaskViewField.name,
          TaskViewField.skills,
          TaskViewField.reward,
          TaskViewField.assignees,
          TaskViewField.createdAt,
        ]
      ),
    [currentView?.fields]
  );
}
