import { TaskViewField } from "@dewo/app/graphql/types";
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
} from "react";

const defaultFields = [
  TaskViewField.gating,
  TaskViewField.name,
  TaskViewField.skills,
  TaskViewField.reward,
  TaskViewField.assignees,
  TaskViewField.createdAt,
];

const TaskViewFieldsContext = createContext<Set<TaskViewField>>(
  new Set(defaultFields)
);

interface Props {
  fields?: TaskViewField[];
  children: ReactNode;
}

export const TaskViewFieldsProvider: FC<Props> = ({ children, fields }) => {
  const value = useMemo(() => new Set(fields), [fields]);
  if (!fields) return <>{children}</>;
  return (
    <TaskViewFieldsContext.Provider value={value}>
      {children}
    </TaskViewFieldsContext.Provider>
  );
};

export function useTaskViewFields() {
  return useContext(TaskViewFieldsContext);
}
