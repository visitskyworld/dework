import {
  CreateTaskInput,
  Task,
  TaskStatusEnum,
  TaskTag,
} from "@dewo/app/graphql/types";
import { Row, Space } from "antd";
import React, { FC, useEffect, useCallback, useState } from "react";
import _ from "lodash";
import {
  DragDropContext,
  DragDropContextProps,
  resetServerContext,
} from "react-beautiful-dnd";
import { orderBetweenTasks, useGroupedTasks } from "./util";
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
  initialValues?: Partial<CreateTaskInput>;
}

const columnWidth = 228; // (lg breakpoint (992) - (statuses.length - 1) * gap (16) - 16 * 2 (left/right padding)) / statuses.length
const noTasks: Task[] = [];
const noTags: TaskTag[] = [];
const noInitialValues: Partial<CreateTaskInput> = {};

export const TaskBoard: FC<Props> = ({
  tasks,
  tags = noTags,
  initialValues = noInitialValues,
}) => {
  const tasksByStatus = useGroupedTasks(tasks);

  const updateTask = useUpdateTask();
  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    async (result) => {
      if (result.reason !== "DROP" || !result.destination) return;

      const taskId = result.draggableId;
      const status = result.destination.droppableId as TaskStatusEnum;

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

      const taskAbove = tasksByStatus[status]?.[indexExcludingItself - 1];
      const taskBelow = tasksByStatus[status]?.[indexExcludingItself];
      const sortKey = orderBetweenTasks(taskAbove, taskBelow);

      await updateTask({ id: taskId, status, sortKey }, task);
    },
    [tasks, tasksByStatus, updateTask]
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
                  tasks={tasksByStatus[status] ?? noTasks}
                  initialValues={initialValues}
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
