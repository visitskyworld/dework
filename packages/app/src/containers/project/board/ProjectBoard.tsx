import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { Row, Space } from "antd";
import { useProject, useUpdateTask } from "../hooks";
import React, { FC, useEffect, useCallback, useState } from "react";
import _ from "lodash";
import {
  DragDropContext,
  DragDropContextProps,
  resetServerContext,
} from "react-beautiful-dnd";
import { orderBetweenTasks, useGroupedTasks } from "./util";
import { ProjectBoardColumn } from "./ProjectBoardColumn";

const statuses: TaskStatusEnum[] = [
  TaskStatusEnum.TODO,
  TaskStatusEnum.IN_PROGRESS,
  TaskStatusEnum.IN_REVIEW,
  TaskStatusEnum.DONE,
];

interface ProjectBoardProps {
  projectId: string;
}

const columnWidth = 300;
const noTasks: Task[] = [];

export const ProjectBoard: FC<ProjectBoardProps> = ({ projectId }) => {
  const project = useProject(projectId);
  const tasksByStatus = useGroupedTasks(project?.tasks ?? noTasks);

  const updateTask = useUpdateTask();
  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    async (result) => {
      if (result.reason !== "DROP" || !result.destination) return;

      const taskId = result.draggableId;
      const status = result.destination.droppableId as TaskStatusEnum;

      const task = project?.tasks.find((t) => t.id === taskId);
      if (!task) return;

      const indexExcludingItself = (() => {
        const newIndex = result.destination.index;
        const oldIndex = result.source.index;
        // To get the cards above and below the currently dropped card
        // we need to offset the new index by 1 if the card was dragged
        // from above in the same lane. The card we're dragging from
        // above makes all other cards move up one step
        if (
          result.source.droppableId === result.destination.droppableId &&
          oldIndex < newIndex
        ) {
          return newIndex + 1;
        }

        return newIndex;
      })();

      const taskAbove = tasksByStatus[status]?.[indexExcludingItself - 1];
      const taskBelow = tasksByStatus[status]?.[indexExcludingItself];
      const sortKey = orderBetweenTasks(taskAbove, taskBelow);

      await updateTask({ id: taskId, status, sortKey }, task);
    },
    [project?.tasks, tasksByStatus, updateTask]
  );

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    resetServerContext();
    setLoaded(true);
  }, []);

  resetServerContext();
  if (!loaded) return null;
  if (!project) return null;
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Row className="dewo-task-board">
        <Space size="middle" align="start">
          {statuses.map((status) => (
            <div key={status} style={{ width: columnWidth }}>
              <ProjectBoardColumn
                status={status}
                project={project}
                tasks={tasksByStatus[status] ?? noTasks}
              />
            </div>
          ))}
        </Space>
      </Row>
    </DragDropContext>
  );
};
