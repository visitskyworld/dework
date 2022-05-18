import { Tabs } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useUpdateTaskView } from "./hooks";
import { getSortKeyBetween } from "../board/util";
import { Tab } from "@dewo/app/components/Tab";

interface Props {
  projectId?: string;
  organizationId?: string;
  userId?: string;
  activeKey?: string;
  extraTabs?: React.ReactElement[];
  hiddenTabs?: React.ReactElement[];
}

const emptyArray: [] = [];
export const TaskViewTabs: FC<Props> = ({
  projectId,
  organizationId,
  userId,
  activeKey,
  extraTabs = emptyArray,
  hiddenTabs = emptyArray,
  children,
}) => {
  const { currentView, hasLocalChanges, views, onChangeViewLocally } =
    useTaskViewContext();
  const { project } = useProject(projectId);
  const router = useRouter();
  const updateTaskView = useUpdateTaskView();

  const canCreate = usePermission("create", {
    __typename: "TaskView",
    organizationId,
    projectId,
    userId,
  } as AtLeast<TaskView, "__typename" | "projectId" | "organizationId" | "userId">);

  const canUpdate = usePermission("update", {
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

  const renderDraggableTab = useCallback(
    (placeholder?: JSX.Element | null) => (node: JSX.Element) => {
      const key = node.key?.toString() ?? "";
      const id = key.replace("view:", "");

      if (!key.startsWith("view:")) {
        return (
          <div key={node.key} className={styles.tab}>
            <div className={styles.tabContent}>{node}</div>
          </div>
        );
      }

      const idx = views.findIndex((v) => v.id === id);
      const isLast = idx === views.length - 1;

      return (
        <>
          <div key={node.key} className={styles.tab}>
            <Draggable draggableId={key} index={idx}>
              {(provided) => (
                <div
                  className={styles.tabContent}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {node}
                </div>
              )}
            </Draggable>
          </div>
          {
            !!isLast && placeholder // Append the placeholder after all draggables
          }
        </>
      );
    },
    [views]
  );

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) return;

      const destIndex = Math.min(destination.index, views.length - 1);

      const indexExcludingItself =
        source.index < destIndex ? destIndex + 1 : destIndex;

      const viewAbove = views[indexExcludingItself - 1];
      const viewBelow = views[indexExcludingItself];
      const sortKey = getSortKeyBetween(viewAbove, viewBelow, (t) => t.sortKey);

      const viewId = views[source.index].id;
      onChangeViewLocally(viewId, { id: viewId, sortKey });
      await updateTaskView({ id: viewId, sortKey });
    },
    [onChangeViewLocally, updateTaskView, views]
  );

  const viewTabs = useMemo(() => {
    if (!views?.length) {
      return (
        <Tabs.TabPane
          tab={<Tab icon={<Icons.ProjectOutlined />}>Board</Tab>}
          disabled
          closable={false}
        >
          {children}
        </Tabs.TabPane>
      );
    }

    return views.map((view) => (
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
        {children}
      </Tabs.TabPane>
    ));
  }, [currentView, views, hasLocalChanges, children]);

  if (!mounted) {
    return <div style={{ height: 48 }} className="bg-body-secondary" />;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Tabs
        activeKey={
          activeKey ?? (!!currentView ? `view:${currentView.id}` : undefined)
        }
        destroyInactiveTabPane
        className={styles.tabs}
        onTabClick={navigateToTab}
        tabBarExtraContent={
          !!currentView && <TaskViewToolbar className="hide-sm" />
        }
        renderTabBar={
          !!canUpdate
            ? (props, DefaultTabBar) => (
                <Droppable droppableId="tab-bar" direction="horizontal">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <DefaultTabBar {...props}>
                        {renderDraggableTab(provided.placeholder)}
                      </DefaultTabBar>
                    </div>
                  )}
                </Droppable>
              )
            : undefined
        }
      >
        {viewTabs}
        {extraTabs}
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
        {hiddenTabs}
      </Tabs>
    </DragDropContext>
  );
};
