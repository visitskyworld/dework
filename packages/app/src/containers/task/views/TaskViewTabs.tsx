import { Tabs, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useState } from "react";
import * as Icons from "@ant-design/icons";
import { ProjectTaskBoard } from "../../project/board/ProjectTaskBoard";
import { useProject, useProjectDetails } from "../../project/hooks";
import { useTaskViewContext } from "./TaskViewContext";
import { TaskView, TaskViewType } from "@dewo/app/graphql/types";
import { TaskViewUpdateFormPopover } from "./form/update/TaskViewUpdateFormPopover";
import styles from "./TaskViewTabs.module.less";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskViewCreateFormPopover } from "./form/create/TaskViewCreateFormPopover";
import { AtLeast } from "@dewo/app/types/general";

interface Props {
  projectId?: string;
  activeKey?: string;
  extraTabs?: React.ReactElement[];
}

export const TaskViewTabs: FC<Props> = ({
  projectId,
  activeKey,
  extraTabs,
}) => {
  const views = useProjectDetails(projectId).project?.taskViews;
  const { currentView, hasLocalChanges } = useTaskViewContext();
  const { project } = useProject(projectId);

  const canCreate = usePermission("create", {
    __typename: "TaskView",
    projectId,
  } as AtLeast<TaskView, "__typename" | "projectId">);

  const router = useRouter();

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

  if (!views || !mounted) return null;

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
        className={`dewo-tabs ${styles.tabs}`}
        onTabClick={navigateToTab}
      >
        {views.map((view) => (
          <Tabs.TabPane
            tab={
              <>
                {view.id === currentView?.id ? (
                  <TaskViewUpdateFormPopover
                    view={view}
                    projectId={projectId!}
                  />
                ) : view.type === TaskViewType.BOARD ? (
                  <Icons.ProjectOutlined />
                ) : (
                  <Icons.UnorderedListOutlined />
                )}
                {view.id === currentView?.id && <div style={{ width: 8 }} />}
                <Typography.Text italic={hasLocalChanges(view.id)}>
                  {view.name}
                </Typography.Text>
              </>
            }
            key={`view:${view.id}`}
            closable={false}
          >
            <ProjectTaskBoard projectId={projectId} />
          </Tabs.TabPane>
        ))}
        {canCreate && (
          <Tabs.TabPane
            key="add"
            tab={<TaskViewCreateFormPopover projectId={projectId!} />}
          />
        )}
        <div />
        {extraTabs}
      </Tabs>
    </>
  );
};