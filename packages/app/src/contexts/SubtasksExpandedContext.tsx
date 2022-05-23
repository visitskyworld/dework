import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from "react";

interface SubtasksExpandedContextValue {
  expanded: Record<string, boolean>;
  toggle(taskId: string): void;
}

const SubtasksExpandedContext = createContext<SubtasksExpandedContextValue>({
  expanded: {},
  toggle: () => {},
});

export const SubtasksExpandedProvider: FC = ({ children }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = useCallback(
    (taskId: string) =>
      setExpanded((prev) => ({ ...prev, [taskId]: !prev[taskId] })),
    []
  );

  return (
    <SubtasksExpandedContext.Provider value={{ expanded, toggle }}>
      {children}
    </SubtasksExpandedContext.Provider>
  );
};

export function useSubtasksExpanded(taskId: string): {
  expanded: boolean;
  toggle(): void;
} {
  const { expanded, toggle } = useContext(SubtasksExpandedContext);
  return {
    expanded: !!expanded[taskId],
    toggle: useCallback(() => toggle(taskId), [taskId, toggle]),
  };
}
