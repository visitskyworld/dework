import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import {
  PermissionFn,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export enum TaskQuickFilter {
  ASSIGNED_REVIEWING_CLAIMABLE = "ASSIGNED_REVIEWING_CLAIMABLE",
}
export interface TaskFilter {
  name?: string;
  tagIds?: string[];
  assigneeIds?: string[];
  ownerIds?: string[];
  statuses?: TaskStatus[];
  projectIds?: string[];
  quickFilter?: TaskQuickFilter;
}

interface TaskFilterValue {
  filter: TaskFilter;
  onChange(filter: TaskFilter): void;
}

const TaskFilterContext = createContext<TaskFilterValue>({
  filter: {},
  onChange: () => {},
});

export const TaskFilterProvider: FC = ({ children }) => {
  const [filter, onChange] = useState<TaskFilter>({});
  return (
    <TaskFilterContext.Provider value={{ filter, onChange }}>
      {children}
    </TaskFilterContext.Provider>
  );
};

export function useTaskFilter(): TaskFilterValue {
  return useContext(TaskFilterContext);
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const matchingName = (name: string | undefined) => (t: Task) =>
  !name?.length || t.name.toLowerCase().includes(name.toLowerCase());
const matchingTags = (tagIds: string[] | undefined) => (t: Task) =>
  !tagIds?.length || t.tags.some((tag) => tagIds.includes(tag.id));
const matchingAssigneeIds = (assigneeIds: string[] | undefined) => (t: Task) =>
  !assigneeIds?.length || t.assignees.some((x) => assigneeIds.includes(x.id));
const matchingOwnerIds = (ownerIds: string[] | undefined) => (t: Task) =>
  !ownerIds?.length || t.owners.some((x) => ownerIds.includes(x.id));
const matchingStatuses = (statuses: TaskStatus[] | undefined) => (t: Task) =>
  !statuses?.length || statuses.includes(t.status);
const matchingProjects = (projectIds: string[] | undefined) => (t: Task) =>
  !projectIds?.length || projectIds.includes(t.projectId);

const matchingQuickFilter =
  (
    filter: TaskQuickFilter | undefined,
    userId: string | undefined,
    permissionFn: PermissionFn
  ) =>
  (t: Task) => {
    switch (filter) {
      case TaskQuickFilter.ASSIGNED_REVIEWING_CLAIMABLE:
        return (
          t.assignees.some((u) => u.id === userId) ||
          t.owners.some((u) => u.id === userId) ||
          (t.status === TaskStatus.TODO &&
            !t.assignees.length &&
            permissionFn("update", t, "assigneeIds"))
        );
      case undefined:
        return true;
      default:
        return false;
    }
  };

export function useFilteredTasks(tasks: Task[]): Task[] {
  const { filter } = useTaskFilter();
  const debouncedFilter = useDebounce(filter, 300);
  const { user } = useAuthContext();
  const permissionFn = usePermissionFn();

  return useMemo(
    () =>
      tasks
        .filter(matchingName(debouncedFilter.name))
        .filter(matchingTags(debouncedFilter.tagIds))
        .filter(matchingAssigneeIds(debouncedFilter.assigneeIds))
        .filter(matchingOwnerIds(debouncedFilter.ownerIds))
        .filter(matchingStatuses(debouncedFilter.statuses))
        .filter(matchingProjects(debouncedFilter.projectIds))
        .filter(
          matchingQuickFilter(
            debouncedFilter.quickFilter,
            user?.id,
            permissionFn
          )
        ),
    [tasks, debouncedFilter, user?.id, permissionFn]
  );
}
