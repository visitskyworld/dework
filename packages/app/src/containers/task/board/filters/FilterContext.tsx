import { Task, TaskStatus } from "@dewo/app/graphql/types";
import React, { createContext, FC, useContext, useMemo, useState } from "react";

export interface TaskFilter {
  name?: string;
  tagIds?: string[];
  assigneeIds?: string[];
  ownerIds?: string[];
  statuses?: TaskStatus[];
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

export function useFilteredTasks(tasks: Task[]): Task[] {
  const { filter } = useTaskFilter();
  return useMemo(
    () =>
      tasks
        .filter(
          (t) =>
            !filter.name?.length ||
            t.name.toLowerCase().includes(filter.name.toLowerCase())
        )
        .filter(
          (t) =>
            !filter.tagIds?.length ||
            t.tags.some((x) => filter.tagIds!.includes(x.id))
        )
        .filter(
          (t) =>
            !filter.assigneeIds?.length ||
            t.assignees.some((x) => filter.assigneeIds!.includes(x.id))
        )
        .filter(
          (t) =>
            !filter.ownerIds?.length ||
            filter.ownerIds.includes(t.ownerId as any)
        )
        .filter(
          (t) => !filter.statuses?.length || filter.statuses.includes(t.status)
        ),
    [tasks, filter]
  );
}
