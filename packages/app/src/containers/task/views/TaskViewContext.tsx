import {
  Role,
  TaskTag,
  TaskView,
  UpdateTaskViewInput,
  User,
} from "@dewo/app/graphql/types";
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
import {
  useOrganizationDetails,
  useOrganizationUsers,
} from "../../organization/hooks";

import { useProjectDetails, useProjectTaskTags } from "../../project/hooks";
import { useOrganizationRoles } from "../../rbac/hooks";
import { useUser, useUserTaskViews } from "../../user/hooks";

const buildKey = (projectId: string) =>
  `TaskViewProvider.lastViewId.${projectId}`;

interface TaskViewValue {
  views: TaskView[];
  currentView?: TaskView;
  hasLocalChanges(viewId: string): boolean;
  onChangeViewLocally(viewId: string, values: UpdateTaskViewInput): void;
  onResetLocalChanges(viewId: string): void;
  saveButtonText: string;
  filterableMembers: User[];
  tags: TaskTag[];
  showBacklog: boolean;
  roles: Role[];
  searchQuery: string;
  onSearchQueryChange(query: string): void;
}

const TaskViewContext = createContext<TaskViewValue>({
  views: [],
  currentView: undefined,
  hasLocalChanges: () => false,
  onChangeViewLocally: () => {},
  onResetLocalChanges: () => {},
  saveButtonText: "Save for everyone",
  filterableMembers: [],
  tags: [],
  showBacklog: true,
  roles: [],
  searchQuery: "",
  onSearchQueryChange: () => {},
});

export const UserTaskViewProvider: FC<{
  userId?: string;
}> = ({ userId, children }) => {
  const router = useRouter();
  const user = useUser(userId);
  const views = useUserTaskViews(userId);

  const filterableMembers = useMemo(() => (user ? [user] : []), [user]);

  if (!userId || !views) return null;

  return (
    <TaskViewProvider
      redirect={() => router.push(user?.permalink ?? "/")}
      views={views}
      lastViewIdKey={buildKey(userId)}
      children={children}
      filterableMembers={filterableMembers}
      saveButtonText="Save"
    />
  );
};

export const OrganizationTaskViewProvider: FC<{
  organizationId?: string;
}> = ({ organizationId, children }) => {
  const router = useRouter();
  const { organization } = useOrganizationDetails(organizationId);

  const roles = useOrganizationRoles(organizationId);
  const { users: filterableMembers } = useOrganizationUsers(organizationId);

  if (!organizationId || !organization?.taskViews) return null;

  return (
    <TaskViewProvider
      redirect={() => router.push(organization?.permalink ?? "/")}
      views={organization.taskViews}
      lastViewIdKey={buildKey(organizationId)}
      children={children}
      filterableMembers={filterableMembers}
      roles={roles}
    />
  );
};

export const ProjectTaskViewProvider: FC<{
  projectId?: string;
}> = ({ projectId, children }) => {
  const router = useRouter();
  const { project } = useProjectDetails(projectId);
  const views = project?.taskViews;
  const showBacklog = project?.options?.showBacklogColumn;
  const roles = useOrganizationRoles(project?.organizationId);

  const { users: filterableMembers } = useOrganizationUsers(
    project?.organizationId
  );
  const tags = useProjectTaskTags(projectId);

  if (!projectId || !views) return null;

  return (
    <TaskViewProvider
      redirect={() => router.push(project?.permalink ?? "/")}
      views={views}
      lastViewIdKey={buildKey(projectId)}
      children={children}
      filterableMembers={filterableMembers}
      tags={tags}
      showBacklog={showBacklog ?? true}
      roles={roles}
    />
  );
};

const emptyArray: [] = [];

const TaskViewProvider: FC<{
  redirect: () => void;
  lastViewIdKey: string;
  views: TaskView[];
  saveButtonText?: string;
  filterableMembers?: User[];
  tags?: TaskTag[];
  showBacklog?: boolean;
  roles?: Role[];
}> = ({
  redirect,
  lastViewIdKey,
  children,
  views,
  saveButtonText = "Save for everyone",
  filterableMembers = emptyArray,
  tags = emptyArray,
  showBacklog = true,
  roles = emptyArray,
}) => {
  const [localViewChanges, setLocalViewChanges] = useState<
    Record<string, TaskView | undefined>
  >({});
  const [searchQuery, onSearchQueryChange] = useState("");

  const router = useRouter();
  const { viewSlug, tab } = router.query as {
    tab?: string;
    viewSlug?: string;
  };

  const view = useMemo(() => {
    if (isSSR) return undefined;
    if (!!tab) return undefined;
    if (!!viewSlug) {
      const view = views?.find((v) => v.slug === viewSlug);
      if (!!view) return view;
    }

    const lastViewId = localStorage.getItem(lastViewIdKey);
    const lastView = views?.find((v) => v.id === lastViewId);
    if (!!lastView) return lastView;
    return views?.[0];
  }, [viewSlug, views, lastViewIdKey, tab]);

  useEffect(() => {
    if (!tab && !view && !!views?.length) {
      redirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, views?.length, tab]);

  useEffect(() => {
    const lastViewId = localStorage.getItem(lastViewIdKey) ?? undefined;
    if (!!view && view.id !== lastViewId) {
      localStorage.setItem(lastViewIdKey, view.id);
    }
  }, [view, lastViewIdKey]);

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
        views,
        currentView: viewWithLocalChanges ?? view,
        hasLocalChanges,
        onChangeViewLocally,
        onResetLocalChanges,
        saveButtonText,
        filterableMembers,
        tags,
        showBacklog,
        roles,
        searchQuery,
        onSearchQueryChange,
      }}
    >
      {useMemo(() => children, [children])}
    </TaskViewContext.Provider>
  );
};

export function useTaskViewContext() {
  return useContext(TaskViewContext);
}
