import React, { FC } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Badge, Space } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskCard } from "./TaskCard";
import { Task, TaskStatus } from "../types/api";

const titleByStatus: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Done",
};

interface TaskBoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onChange(task: Task): void;
}

export const TaskBoardColumn: FC<TaskBoardColumnProps> = ({
  status,
  tasks,
  onChange,
}) => {
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
          <span>{titleByStatus[status]}</span>
        </Space>
      }
      extra={
        <>
          <Button
            type="text"
            icon={<Icons.PlusOutlined onClick={() => alert("button")} />}
          />
        </>
      }
      style={{ width: 300 }}
    >
      <Droppable key={status} droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ ...provided.droppableProps, minHeight: 30 }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      marginTop: index === 0 ? 8 : 8,
                    }}
                  >
                    <TaskCard task={task} onChange={onChange} />
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
