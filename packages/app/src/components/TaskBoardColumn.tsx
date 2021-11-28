import React, { FC, useCallback, useState } from "react";
import * as uuid from "uuid";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Badge, Space, Modal, Input } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskCard } from "./TaskCard";
import { Task, TaskStatus } from "../types/api";

const titleByStatus: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.RESERVED]: "Reserved",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Done",
};

interface TaskBoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onChange(task: Task): void;
  onAdd(task: Task): void;
}

export const TaskBoardColumn: FC<TaskBoardColumnProps> = ({
  status,
  tasks,
  onChange,
  onAdd,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const createTask = useCallback(() => {
    onAdd({
      id: uuid.v4(),
      sortKey: String(Date.now()),
      title,
      subtitle,
      status,
      tags: [],
    });
    setShowCreateModal(false);
    setTitle("");
    setSubtitle("");
  }, [title, subtitle, onAdd, status]);
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
            icon={
              <Icons.PlusOutlined onClick={() => setShowCreateModal(true)} />
            }
          />
        </>
      }
      style={{ width: 300 }}
    >
      <Modal
        title="Create Task"
        visible={showCreateModal}
        okText="Create"
        okButtonProps={{ disabled: !title }}
        onOk={createTask}
        onCancel={() => setShowCreateModal(false)}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            size="large"
            placeholder="Task Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input.TextArea
            size="large"
            placeholder="Task Description"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </Space>
      </Modal>
      <Droppable key={status} droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ ...provided.droppableProps, minHeight: 30 }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
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
