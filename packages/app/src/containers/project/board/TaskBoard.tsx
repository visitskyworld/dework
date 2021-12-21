import { Task, TaskStatusEnum, TaskTag } from "@dewo/app/graphql/types";
import { Row, Space } from "antd";
import React, { FC, useEffect, useCallback, useState } from "react";
import {
  DragDropContext,
  DragDropContextProps,
  resetServerContext,
} from "react-beautiful-dnd";
import { orderBetweenTasks, TaskSection, useGroupedTasks } from "./util";
import { TaskBoardColumn } from "./TaskBoardColumn";
import { useUpdateTask } from "../../task/hooks";
import { TaskUpdateModalListener } from "../../task/TaskUpdateModal";

const statuses: TaskStatusEnum[] = [
  TaskStatusEnum.TODO,
  TaskStatusEnum.IN_PROGRESS,
  TaskStatusEnum.IN_REVIEW,
  TaskStatusEnum.DONE,
];

interface Props {
  tasks: Task[];
  tags?: TaskTag[];
  projectId?: string;
}

const columnWidth = 300;
const emptySections: TaskSection[] = [{ tasks: [] }];
const noTags: TaskTag[] = [];

export const TaskBoard: FC<Props> = ({ tasks, projectId, tags = noTags }) => {
  const taskSectionsByStatus = useGroupedTasks(tasks, projectId);

  const updateTask = useUpdateTask();
  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    async (result) => {
      if (result.reason !== "DROP" || !result.destination) return;

      const taskId = result.draggableId;
      const [status, sectionIndexString] = result.destination.droppableId.split(
        ":"
      ) as [TaskStatusEnum, string];
      const sectionIndex = Number(sectionIndexString);

      const task = tasks.find((t) => t.id === taskId);
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

      const section = taskSectionsByStatus[status]?.[sectionIndex];
      const taskAbove = section?.tasks[indexExcludingItself - 1];
      const taskBelow = section?.tasks[indexExcludingItself];
      const sortKey = orderBetweenTasks(taskAbove, taskBelow);

      await updateTask({ id: taskId, status, sortKey }, task);
    },
    [tasks, taskSectionsByStatus, updateTask]
  );

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    resetServerContext();
    setLoaded(true);
  }, []);

  resetServerContext();
  if (!loaded) return null;
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Row className="dewo-task-board">
          <Space size="middle" align="start">
            {statuses.map((status) => (
              <div key={status} style={{ width: columnWidth }}>
                <TaskBoardColumn
                  status={status}
                  tags={tags}
                  width={columnWidth}
                  taskSections={taskSectionsByStatus[status] ?? emptySections}
                  projectId={projectId}
                />
              </div>
            ))}
          </Space>
        </Row>
      </DragDropContext>
      <TaskUpdateModalListener />
    </>
  );
};
