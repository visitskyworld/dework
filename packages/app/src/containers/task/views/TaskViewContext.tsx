import { TaskView, UpdateTaskViewInput } from "@dewo/app/graphql/types";
import { isSSR } from "@dewo/app/util/isSSR";
import _ from "lodash";
import { useRouter } from "next/router";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProject, useProjectDetails } from "../../project/hooks";

const buildKey = (projectId: string) =>
  `TaskViewProvider.lastViewId.${projectId}`;

interface TaskViewValue {
  views: TaskView[];
  currentView?: TaskView;
  hasLocalChanges(viewId: string): boolean;
  onChangeViewLocally(viewId: string, values: UpdateTaskViewInput): void;
  onResetLocalChanges(viewId: string): void;
}

const TaskViewContext = createContext<TaskViewValue>({
  views: [],
  currentView: undefined,
  hasLocalChanges: () => false,
  onChangeViewLocally: () => {},
  onResetLocalChanges: () => {},
});

interface ProviderProps {
  projectId?: string;
}

export const TaskViewProvider: FC<ProviderProps> = ({
  projectId,
  children,
}) => {
  const [localViewChanges, setLocalViewChanges] = useState<
    Record<string, TaskView | undefined>
  >({});

  const router = useRouter();
  const { viewSlug } = router.query as {
    organizationSlug: string;
    projectSlug: string;
    viewSlug?: string;
  };

  const { project } = useProject(projectId);
  const views = useProjectDetails(projectId).project?.taskViews;

  const key = useMemo(() => buildKey(projectId!), [projectId]);
  const view = useMemo(() => {
    if (isSSR) return undefined;
    if (!!viewSlug) {
      const view = views?.find((v) => v.slug === viewSlug);
      if (!!view) return view;
    }

    const lastViewId = localStorage.getItem(key);
    const lastView = views?.find((v) => v.id === lastViewId);
    if (!!lastView) return lastView;
    return views?.[0];
  }, [viewSlug, views, key]);

  useEffect(() => {
    if (!view && !!views?.length && !!project) {
      router.push(project.permalink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, views?.length, project]);

  useEffect(() => {
    const lastViewId = localStorage.getItem(key) ?? undefined;
    if (!!view && view.id !== lastViewId) {
      localStorage.setItem(key, view.id);
    }
  }, [view, key]);

  const viewWithLocalChanges = useMemo(
    () => (!!view ? localViewChanges[view.id] : undefined),
    [view, localViewChanges]
  );

  const onChangeViewLocally = useCallback(
    (viewId: string, changes: UpdateTaskViewInput) => {
      const view = views?.find((v) => v.id === viewId);
      if (!view) return;
      setLocalViewChanges((prev) => ({
        ...prev,
        [viewId]: Object.assign({}, view, changes),
      }));
    },
    [views]
  );

  const onResetLocalChanges = useCallback(
    (viewId: string) =>
      setLocalViewChanges((prev) => ({ ...prev, [viewId]: undefined })),
    []
  );

  const hasLocalChanges = useCallback(
    (viewId: string) => {
      const view = views?.find((v) => v.id === viewId);
      const localChanges = localViewChanges[viewId];
      return !!view && !!localChanges && !_.isEqual(view, localChanges);
    },
    [views, localViewChanges]
  );

  return (
    <TaskViewContext.Provider
      value={{
        views: useMemo(() => views ?? [], [views]),
        currentView: viewWithLocalChanges ?? view,
        hasLocalChanges,
        onChangeViewLocally,
        onResetLocalChanges,
      }}
    >
      {useMemo(() => children, [children])}
    </TaskViewContext.Provider>
  );
};

export function useTaskViewContext() {
  return useContext(TaskViewContext);
}
