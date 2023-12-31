import {
  Role,
  TaskTag,
  TaskView,
  UpdateTaskViewInput,
  User,
  WorkspaceDetails,
} from "@dewo/app/graphql/types";
import { LocalStorage } from "@dewo/app/util/LocalStorage";
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
  useOrganizationTaskViews,
  useOrganizationUsers,
} from "../../organization/hooks";

import { useProjectDetails, useProjectTaskTags } from "../../project/hooks";
import { useOrganizationRoles } from "../../rbac/hooks";
import { useUser, useUserTaskViews } from "../../user/hooks";
import { TaskViewFieldsProvider } from "./TaskViewFieldsContext";

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

export const WorkspaceTaskViewProvider: FC<{
  workspace: WorkspaceDetails;
}> = ({ workspace, children }) => {
  const router = useRouter();
  const roles = useOrganizationRoles(workspace.organizationId);
  const { users: filterableMembers } = useOrganizationUsers(
    workspace.organizationId
  );

  const tags = useMemo(
    () =>
      _.sortBy(
        workspace?.projects.map((project) => project.taskTags).flat(),
        (taskTag) => taskTag.label.toLowerCase()
      ),
    [workspace?.projects]
  );

  return (
    <TaskViewProvider
      redirect={() => router.push(workspace?.permalink ?? "/")}
      views={workspace.taskViews}
      lastViewIdKey={buildKey(workspace.id)}
      children={children}
      filterableMembers={filterableMembers}
      tags={tags}
      roles={roles}
    />
  );
};

export const OrganizationTaskViewProvider: FC<{
  organizationId?: string;
}> = ({ organizationId, children }) => {
  const router = useRouter();
  const { organization } = useOrganizationTaskViews(organizationId);
  const roles = useOrganizationRoles(organizationId);
  const { users: filterableMembers } = useOrganizationUsers(organizationId);

  const tags = useMemo(
    () =>
      _.sortBy(
        organization?.projects.map((project) => project.taskTags).flat(),
        (taskTag) => taskTag.label.toLowerCase()
      ),
    [organization?.projects]
  );

  if (!organizationId || !organization?.taskViews) return null;

  return (
    <TaskViewProvider
      redirect={() => router.push(organization?.permalink ?? "/")}
      views={organization.taskViews}
      lastViewIdKey={buildKey(organizationId)}
      children={children}
      filterableMembers={filterableMembers}
      tags={tags}
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
  const roles = useOrganizationRoles(project?.organizationId);

  const { users: filterableMembers } = useOrganizationUsers(
    project?.organizationId
  );
  const tags = useProjectTaskTags(projectId);

  if (!projectId || !views) return <>{children}</>;
  return (
    <TaskViewProvider
      redirect={() => router.push(project?.permalink ?? "/")}
      views={views}
      lastViewIdKey={buildKey(projectId)}
      children={children}
      filterableMembers={filterableMembers}
      tags={tags}
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
  roles?: Role[];
}> = ({
  redirect,
  lastViewIdKey,
  children,
  views,
  saveButtonText = "Save for everyone",
  filterableMembers = emptyArray,
  tags = emptyArray,
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
    if (!!tab) return undefined;
    if (!!viewSlug) {
      const view = views?.find((v) => v.slug === viewSlug);
      if (!!view) return view;
    }

    const lastViewId = LocalStorage.getItem(lastViewIdKey);
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
    const lastViewId = LocalStorage.getItem(lastViewIdKey) ?? undefined;
    if (!!view && view.id !== lastViewId) {
      LocalStorage.setItem(lastViewIdKey, view.id);
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

  const currentView = viewWithLocalChanges ?? view;
  return (
    <TaskViewContext.Provider
      value={{
        views: useMemo(
          () =>
            _.sortBy(
              views,
              (t) => localViewChanges[t.id]?.sortKey ?? t.sortKey,
              "asc"
            ),
          [localViewChanges, views]
        ),
        currentView,
        hasLocalChanges,
        onChangeViewLocally,
        onResetLocalChanges,
        saveButtonText,
        filterableMembers,
        tags,
        roles,
        searchQuery,
        onSearchQueryChange,
      }}
    >
      <TaskViewFieldsProvider fields={currentView?.fields}>
        {useMemo(() => children, [children])}
      </TaskViewFieldsProvider>
    </TaskViewContext.Provider>
  );
};

export function useTaskViewContext() {
  return useContext(TaskViewContext);
}
