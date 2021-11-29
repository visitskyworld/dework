import React, { FC } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Badge, Space } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskCard } from "./TaskCard";
import { ProjectDetails, Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { STATUS_LABEL } from "./util";
import { TaskCreateModal } from "../../task/TaskCreateModal";

interface ProjectBoardColumnProps {
  status: TaskStatusEnum;
  tasks: Task[];
  project: ProjectDetails;
}

export const ProjectBoardColumn: FC<ProjectBoardColumnProps> = ({
  status,
  tasks,
  project,
}) => {
  const createCardToggle = useToggle();
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
        <>
          <Button
            type="text"
            icon={<Icons.PlusOutlined onClick={createCardToggle.onToggleOn} />}
          />
        </>
      }
      style={{ width: 300 }}
    >
      <TaskCreateModal
        project={project}
        initialValues={{ projectId: project.id, status }}
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
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
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
