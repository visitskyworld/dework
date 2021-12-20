import React, { FC, Fragment, useMemo } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Badge, Space, Typography, Row } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskCard } from "./TaskCard";
import {
  CreateTaskInput,
  TaskStatusEnum,
  TaskTag,
} from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Can, usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { STATUS_LABEL, TaskSection } from "./util";
import { TaskCreateModal } from "../../task/TaskCreateModal";

interface Props {
  status: TaskStatusEnum;
  taskSections: TaskSection[];
  tags: TaskTag[];
  width: number;
  initialValues: Partial<CreateTaskInput>;
}

export const TaskBoardColumn: FC<Props> = ({
  status,
  taskSections,
  tags,
  width,
  initialValues,
}) => {
  const createCardToggle = useToggle();
  const hasPermission = usePermissionFn();
  const count = useMemo(
    () =>
      taskSections.reduce((count, section) => count + section.tasks.length, 0),
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
        <Can I="create" a="Task">
          <Button
            type="text"
            icon={<Icons.PlusOutlined onClick={createCardToggle.toggleOn} />}
          />
        </Can>
      }
      style={{ width }}
      className="dewo-task-board-column"
    >
      <TaskCreateModal
        tags={tags}
        initialValues={useMemo(
          () => ({ ...initialValues, status }),
          [status, initialValues]
        )}
        visible={createCardToggle.isOn}
        onCancel={createCardToggle.toggleOff}
        onDone={createCardToggle.toggleOff}
      />
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
            <Droppable droppableId={[status, index].join(":")}>
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
                      isDragDisabled={!hasPermission("update", task)}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            cursor: hasPermission("update", task)
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
                </div>
              )}
            </Droppable>
          </Fragment>
        ))}
    </Card>
  );
};
