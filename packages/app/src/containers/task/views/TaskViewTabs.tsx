import { Divider, Tabs } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useProject } from "../../project/hooks";
import { useTaskViewContext } from "./TaskViewContext";
import { TaskView, TaskViewType } from "@dewo/app/graphql/types";
import { TaskViewUpdateFormPopover } from "./form/update/TaskViewUpdateFormPopover";
import styles from "./TaskViewTabs.module.less";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskViewCreateFormPopover } from "./form/create/TaskViewCreateFormPopover";
import { AtLeast } from "@dewo/app/types/general";
import { TaskViewToolbar } from "./TaskViewToolbar";

interface Props {
  projectId?: string;
  organizationId?: string;
  userId?: string;
  activeKey?: string;
  extraTabs?: React.ReactElement[];
}

export const TaskViewTabs: FC<Props> = ({
  projectId,
  organizationId,
  userId,
  activeKey,
  extraTabs,
  children,
}) => {
  const { currentView, hasLocalChanges, views } = useTaskViewContext();
  const { project } = useProject(projectId);
  const router = useRouter();

  const canCreate = usePermission("create", {
    __typename: "TaskView",
    organizationId,
    projectId,
    userId,
  } as AtLeast<TaskView, "__typename" | "projectId" | "organizationId" | "userId">);

  const navigateToTab = useCallback(
    (tabKey: string) => {
      if (tabKey.startsWith("view:")) {
        const viewId = tabKey.replace("view:", "");
        const view = views?.find((v) => v.id === viewId);
        if (!!view) router.push(view.permalink);
      } else if (!["add", "null"].includes(tabKey)) {
        router.push(`${project!.permalink}/${tabKey}`);
      }
    },
    [router, views, project]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!views || !mounted) {
    return <div style={{ height: 48 }} className="bg-body-secondary" />;
  }

  const styleToMakeExtraTabsRightAligned = (
    <style
      children={`
        .${styles.tabs} .ant-tabs-tab:nth-child(${
        views.length + (canCreate ? 2 : 1)
      }) {
          flex: 1;
          cursor: unset;
        }
      `}
    />
  );

  return (
    <>
      {styleToMakeExtraTabsRightAligned}
      <Tabs
        activeKey={
          activeKey ?? (!!currentView ? `view:${currentView.id}` : undefined)
        }
        destroyInactiveTabPane
        className={styles.tabs}
        onTabClick={navigateToTab}
      >
        {views.map((view) => (
          <Tabs.TabPane
            tab={
              <>
                {view.id === currentView?.id ? (
                  <TaskViewUpdateFormPopover view={view} />
                ) : view.type === TaskViewType.BOARD ? (
                  <Icons.ProjectOutlined />
                ) : (
                  <Icons.UnorderedListOutlined />
                )}
                {view.id === currentView?.id && <div style={{ width: 8 }} />}
                {hasLocalChanges(view.id) ? <i>{view.name}</i> : view.name}
              </>
            }
            key={`view:${view.id}`}
            closable={false}
          >
            <TaskViewToolbar />
            <Divider style={{ margin: 0 }} />
            {children}
          </Tabs.TabPane>
        ))}
        {canCreate && (
          <Tabs.TabPane
            key="add"
            tab={
              <TaskViewCreateFormPopover
                projectId={projectId}
                userId={userId}
                organizationId={organizationId}
              />
            }
          />
        )}
        <div />
        {extraTabs}
      </Tabs>
    </>
  );
};
