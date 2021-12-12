import React, { FC, useMemo } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Badge, Space } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskCard } from "./TaskCard";
import {
  CreateTaskInput,
  Task,
  TaskStatusEnum,
  TaskTag,
} from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { STATUS_LABEL } from "./util";
import { TaskCreateModal } from "../../task/TaskCreateModal";
import { Can, usePermissionFn } from "@dewo/app/contexts/PermissionsContext";

interface Props {
  status: TaskStatusEnum;
  tasks: Task[];
  tags: TaskTag[];
  width: number;
  initialValues: Partial<CreateTaskInput>;
}

export const TaskBoardColumn: FC<Props> = ({
  status,
  tasks,
  tags,
  width,
  initialValues,
}) => {
  const createCardToggle = useToggle();
  const hasPermission = usePermissionFn();
  return (
    <Card
      size="small"
      title={
        <Space>
          <Badge
            count={tasks.length}
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
            icon={<Icons.PlusOutlined onClick={createCardToggle.onToggleOn} />}
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
        visible={createCardToggle.value}
        onCancel={createCardToggle.onToggleOff}
        onDone={createCardToggle.onToggleOff}
      />
      <Droppable key={status} droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ ...provided.droppableProps, minHeight: 30, paddingTop: 4 }}
          >
            {tasks.map((task, index) => (
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
    </Card>
  );
};
