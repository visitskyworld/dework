import React, { FC } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Button,
  Tag,
  Breadcrumb,
  Card,
  Typography,
  Badge,
  Space,
  Row,
} from "antd";
import * as Icons from "@ant-design/icons";
import { TaskCard } from "./TaskCard";
import { Task } from "../types/Task";

interface TaskBoardColumnProps {
  index: number;
  tasks: Task[];
}

export const TaskBoardColumn: FC<TaskBoardColumnProps> = ({ index, tasks }) => {
  return (
    <Card
      size="small"
      title={
        <Space>
          <Badge count={25} />
          <span>TODO</span>
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
      <Droppable key={index} droppableId={String(index)}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
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
