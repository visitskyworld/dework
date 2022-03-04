import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Badge, Space, Row } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskCard } from "./TaskCard";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Can, usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { STATUS_LABEL, TaskSection } from "./util";
import { TaskCreateModal } from "../TaskCreateModal";
import { TaskFormValues } from "../form/TaskForm";
import {
  TaskBoardColumnEmpty,
  TaskBoardColumnEmptyProps,
} from "./TaskBoardColumnEmtpy";
import { TaskSectionTitle } from "./TaskSectionTitle";

interface Props {
  status: TaskStatus;
  taskSections: TaskSection[];
  width: number;
  projectId?: string;
  currentlyDraggingTask?: Task;
  footer?: ReactNode;
  empty?: TaskBoardColumnEmptyProps;
}

export const TaskBoardColumn: FC<Props> = ({
  status,
  taskSections,
  width,
  projectId,
  currentlyDraggingTask,
  footer,
  empty,
}) => {
  const createTaskToggle = useToggle();
  const hasPermission = usePermissionFn();
  const count = useMemo(
    () =>
      taskSections.reduce((count, section) => count + section.tasks.length, 0),
    [taskSections]
  );
  const initialValues = useMemo<Partial<TaskFormValues>>(
    () => ({ status }),
    [status]
  );

  const isEmpty = useMemo(
    () => taskSections.every((s) => !s.tasks.length),
    [taskSections]
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
          <Badge
            count={count}
            style={{ backgroundColor: Colors.grey[6] }}
            showZero
          />
          <span>{STATUS_LABEL[status]}</span>
        </Space>
      }
      extra={
        !!projectId && (
          <Can I="create" this={{ __typename: "Task", status }}>
            <Button
              type="text"
              icon={<Icons.PlusOutlined onClick={createTaskToggle.toggleOn} />}
            />
          </Can>
        )
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
      {taskSections.map(
        (section, index) =>
          !section.hidden && (
            <div key={index}>
              {!!section.title && (
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
                    title={`${section.title} (${section.tasks.length})`}
                  />
                  <Button
                    type="text"
                    size="small"
                    className="text-secondary"
                    icon={
                      collapsed[section.id] ? (
                        <Icons.CaretUpOutlined />
                      ) : (
                        <Icons.CaretDownOutlined />
                      )
                    }
                    onClick={() => toggleCollapsed(section.id)}
                  />
                  <div style={{ flex: 1 }} />
                  {section.button}
                </Row>
              )}
              {!collapsed[section.id] && (
                <Droppable
                  droppableId={[status, index].join(":")}
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
                      {isEmpty && !!empty && (
                        <TaskBoardColumnEmpty {...empty} />
                      )}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          )
      )}
      {footer}
    </Card>
  );
};
