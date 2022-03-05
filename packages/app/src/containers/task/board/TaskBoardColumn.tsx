import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Badge, Space, Row } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskCard } from "./TaskCard";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Can, usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { STATUS_LABEL, TaskGroup } from "./util";
import { TaskCreateModal } from "../TaskCreateModal";
import { TaskFormValues } from "../form/TaskForm";
import {
  TaskBoardColumnEmpty,
  TaskBoardColumnEmptyProps,
} from "./TaskBoardColumnEmtpy";
import { TaskBoardColumnOptionButton } from "./TaskBoardColumnOptionButton";
import { TaskSectionTitle } from "./TaskSectionTitle";

interface Props {
  status: TaskStatus;
  groups: TaskGroup[];
  width: number;
  projectId?: string;
  currentlyDraggingTask?: Task;
  footer?: ReactNode;
  empty?: TaskBoardColumnEmptyProps;
}

export const TaskBoardColumn: FC<Props> = ({
  status,
  groups,
  width,
  projectId,
  currentlyDraggingTask,
  footer,
  empty,
}) => {
  const createTaskToggle = useToggle();
  const hasPermission = usePermissionFn();
  const count = useMemo(
    () => groups.reduce((count, group) => count + group.tasks.length, 0),
    [groups]
  );
  const initialValues = useMemo<Partial<TaskFormValues>>(
    () => ({ status }),
    [status]
  );

  const isEmpty = useMemo(() => groups.every((g) => !g.tasks.length), [groups]);

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
          <Badge
            count={count}
            style={{ backgroundColor: Colors.grey[6] }}
            showZero
          />
          <span>{STATUS_LABEL[status]}</span>
        </Space>
      }
      extra={
        <>
          {!!projectId && status !== TaskStatus.DONE && (
            <TaskBoardColumnOptionButton
              status={status}
              projectId={projectId}
            />
          )}
          {!!projectId && (
            <Can I="create" this={{ __typename: "Task", status }}>
              <Button
                type="text"
                icon={
                  <Icons.PlusOutlined onClick={createTaskToggle.toggleOn} />
                }
              />
            </Can>
          )}
        </>
      }
      style={{ width, backgroundColor: "#1B1D4B" }}
      className="dewo-task-board-column"
    >
      {!!projectId && (
        <TaskCreateModal
          projectId={projectId}
          initialValues={initialValues}
          visible={createTaskToggle.isOn}
          onCancel={createTaskToggle.toggleOff}
          onDone={createTaskToggle.toggleOff}
        />
      )}
      {groups.map((group, index) => (
        <div key={index}>
          {groups.length > 1 && (
            <Row
              align="middle"
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#1B1D4B",
                zIndex: 1,
                paddingTop: 8,
              }}
            >
              <TaskSectionTitle
                title={`${group.section?.name ?? "Uncategorized"} (${
                  group.tasks.length
                })`}
                collapsed={collapsed[group.id]}
                onChangeCollapsed={() => toggleCollapsed(group.id)}
              />
              {/* <div style={{ flex: 1 }} /> */}
              {/* {section.button} */}
            </Row>
          )}
          {!collapsed[group.id] && (
            <Droppable
              droppableId={[status, group.id].join(":")}
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
                  {group.tasks.map((task, index) => (
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
                  {index === groups.length - 1 && isEmpty && !!empty && (
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
