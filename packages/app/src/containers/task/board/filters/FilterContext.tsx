import { Task, TaskStatus } from "@dewo/app/graphql/types";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface TaskFilter {
  name?: string;
  tagIds?: string[];
  assigneeIds?: string[];
  ownerIds?: string[];
  statuses?: TaskStatus[];
  projects?: string[];
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

export function useFilteredTasks(tasks: Task[]): Task[] {
  const { filter } = useTaskFilter();
  const debouncedFilter = useDebounce(filter, 300);

  return useMemo(
    () =>
      tasks
        .filter(
          (t) =>
            !debouncedFilter.name?.length ||
            t.name.toLowerCase().includes(debouncedFilter.name.toLowerCase())
        )
        .filter(
          (t) =>
            !debouncedFilter.tagIds?.length ||
            t.tags.some((x) => debouncedFilter.tagIds!.includes(x.id))
        )
        .filter(
          (t) =>
            !debouncedFilter.assigneeIds?.length ||
            t.assignees.some((x) => debouncedFilter.assigneeIds!.includes(x.id))
        )
        .filter(
          (t) =>
            !debouncedFilter.ownerIds?.length ||
            debouncedFilter.ownerIds.includes(t.ownerId as any)
        )
        .filter(
          (t) =>
            !debouncedFilter.statuses?.length ||
            debouncedFilter.statuses.includes(t.status)
        )
        .filter(
          (t) =>
            !debouncedFilter.projects?.length ||
            debouncedFilter.projects.includes(t.projectId)
        ),
    [tasks, debouncedFilter]
  );
}
