import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Badge, Space, Row } from "antd";
import * as Icons from "@ant-design/icons";
import { TaskCard } from "../card/TaskCard";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { Can, usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { STATUS_LABEL, TaskSectionData } from "./util";
import {
  TaskBoardColumnEmpty,
  TaskBoardColumnEmptyProps,
} from "./TaskBoardColumnEmtpy";
import { TaskBoardColumnOptionButton } from "./TaskBoardColumnOptionButton";
import { TaskSectionTitle } from "./TaskSectionTitle";
import { TaskSectionOptionButton } from "./TaskSectionOptionButton";
import { useProject } from "../../project/hooks";
import Link from "next/link";

interface Props {
  status: TaskStatus;
  sections: TaskSectionData[];
  width: number;
  projectId?: string;
  currentlyDraggingTask?: Task;
  footer?: ReactNode;
  empty?: TaskBoardColumnEmptyProps;
}

export const TaskBoardColumn: FC<Props> = ({
  status,
  sections,
  width,
  projectId,
  currentlyDraggingTask,
  footer,
  empty,
}) => {
  const hasPermission = usePermissionFn();
  const count = useMemo(
    () => sections.reduce((count, section) => count + section.tasks.length, 0),
    [sections]
  );

  const { project } = useProject(projectId);
  const isEmpty = useMemo(
    () => sections.every((g) => !g.tasks.length),
    [sections]
  );
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleCollapsed = useCallback(
    (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] })),
    []
  );

  return (
    <Card
      size="small"
      title={
        <Space>
          <Badge count={count} showZero />
          <span>{STATUS_LABEL[status]}</span>
        </Space>
      }
      extra={
        <>
          {!!projectId && status !== TaskStatus.DONE && (
            <Can I="create" this={{ __typename: "TaskSection", projectId }}>
              <TaskBoardColumnOptionButton
                status={status}
                projectId={projectId}
              />
            </Can>
          )}
          {!!project && (
            <Can
              I="create"
              this={{
                __typename: "Task",
                status,
                projectId,
                // @ts-ignore
                ...{ ownerIds: [] },
              }}
            >
              <Link
                href={`${project.permalink}/create?values=${encodeURIComponent(
                  JSON.stringify({ status })
                )}`}
              >
                <Button type="text" icon={<Icons.PlusOutlined />} />
              </Link>
            </Can>
          )}
        </>
      }
      style={{ width }}
      className="dewo-task-board-column"
    >
      {sections.map((section, index) => (
        <div key={index}>
          {sections.length > 1 && (
            <Row
              align="middle"
              className="dewo-task-board-column-section-title"
            >
              <TaskSectionTitle
                title={`${section.title} (${section.tasks.length})`}
                collapsed={collapsed[section.id]}
                onChangeCollapsed={() => toggleCollapsed(section.id)}
              />
              <div style={{ flex: 1 }} />
              {!!section.section && (
                <TaskSectionOptionButton
                  section={section.section}
                  projectId={projectId}
                />
              )}
              {section.button}
            </Row>
          )}
          {!collapsed[section.id] && (
            <Droppable
              droppableId={[status, section.id].join(":")}
              isDropDisabled={
                !currentlyDraggingTask ||
                (currentlyDraggingTask.status === TaskStatus.DONE &&
                  status === TaskStatus.DONE) ||
                !hasPermission(
                  "update",
                  currentlyDraggingTask,
                  `status[${status}]`
                )
              }
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ ...provided.droppableProps, paddingTop: 8 }}
                >
                  {section.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                      isDragDisabled={
                        !hasPermission("update", task, `status[${status}]`)
                      }
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            cursor: hasPermission("update", task, "status")
                              ? "grab"
                              : "pointer",
                            marginBottom: 8,
                          }}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {index === sections.length - 1 && isEmpty && !!empty && (
                    <TaskBoardColumnEmpty {...empty} />
                  )}
                </div>
              )}
            </Droppable>
          )}
        </div>
      ))}
      {footer}
    </Card>
  );
};
