import React, { FC, Fragment, ReactNode, useMemo } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  Button,
  Card,
  Badge,
  Space,
  Typography,
  Row,
  Empty,
  Avatar,
} from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskCard } from "./TaskCard";
import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Can, usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { STATUS_LABEL, TaskSection } from "./util";
import { TaskCreateModal } from "../../task/TaskCreateModal";
import { TaskFormValues } from "../../task/TaskForm";

const emptyStateTitle: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.TODO]: "Put out tasks, let contributors explore and apply",
  [TaskStatusEnum.IN_PROGRESS]: "Keep track of contributor tasks in progress",
  [TaskStatusEnum.IN_REVIEW]: "When a contributor is done, review the work",
  [TaskStatusEnum.DONE]: "Pay for completed tasks in crypto using any token",
};

const emptyStateIcon: Record<TaskStatusEnum, ReactNode> = {
  [TaskStatusEnum.TODO]: <Icons.UsergroupAddOutlined />,
  [TaskStatusEnum.IN_PROGRESS]: <Icons.ThunderboltOutlined />,
  [TaskStatusEnum.IN_REVIEW]: <Icons.SafetyOutlined />,
  [TaskStatusEnum.DONE]: <Icons.DollarCircleOutlined />,
};

interface Props {
  status: TaskStatusEnum;
  taskSections: TaskSection[];
  width: number;
  projectId?: string;
  currentlyDraggingTask?: Task;
}

export const TaskBoardColumn: FC<Props> = ({
  status,
  taskSections,
  width,
  projectId,
  currentlyDraggingTask,
}) => {
  const createCardToggle = useToggle();
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

  const empty = useMemo(
    () => taskSections.every((s) => !s.tasks.length),
    [taskSections]
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
          <Can I="create" a="Task">
            <Button
              type="text"
              icon={<Icons.PlusOutlined onClick={createCardToggle.toggleOn} />}
            />
          </Can>
        )
      }
      style={{ width }}
      className="dewo-task-board-column"
    >
      {!!projectId && (
        <TaskCreateModal
          projectId={projectId}
          initialValues={initialValues}
          visible={createCardToggle.isOn}
          onCancel={createCardToggle.toggleOff}
          onDone={createCardToggle.toggleOff}
        />
      )}
      {taskSections
        .filter((section) => !section.hidden)
        .map((section, index) => (
          <Fragment key={index}>
            {!!section.title && (
              <Row align="middle">
                <Typography.Text
                  type="secondary"
                  style={{
                    flex: 1,
                    fontWeight: "bold",
                    fontSize: 11,
                    // textAlign: "center",
                    display: "block",
                    paddingTop: index === 0 ? 0 : 8,
                  }}
                >
                  {section.title.toUpperCase()}
                </Typography.Text>
                {section.button}
              </Row>
            )}
            <Droppable
              droppableId={[status, index].join(":")}
              isDropDisabled={
                !currentlyDraggingTask ||
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
                  style={{
                    ...provided.droppableProps,
                    minHeight: 90,
                    paddingTop: 4,
                  }}
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
                  {empty && (
                    <Empty
                      description={emptyStateTitle[status]}
                      image={
                        <Avatar size={64} style={{ fontSize: 32 }}>
                          {emptyStateIcon[status]}
                        </Avatar>
                      }
                      imageStyle={{
                        height: 72,
                        paddingLeft: 24,
                        paddingRight: 24,
                      }}
                      style={{ padding: 8 }}
                    />
                  )}
                </div>
              )}
            </Droppable>
          </Fragment>
        ))}
    </Card>
  );
};
