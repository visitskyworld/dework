import { Row, Space } from "antd";
import React, { FC, useMemo, useEffect, useCallback, useState } from "react";
import _ from "lodash";
import { inject } from "between";
import {
  DragDropContext,
  DragDropContextProps,
  resetServerContext,
} from "react-beautiful-dnd";

import { Task, TaskStatus } from "../types/api";
import { TaskBoardColumn } from "./TaskBoardColumn";

const Between = inject("0123456789");

const columns = [
  TaskStatus.TODO,
  TaskStatus.RESERVED,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];
const columnWidth = 300;
const noTasks: Task[] = [];
interface Props {
  tasks: Task[];
  onChange(tasks: Task[]): void;
}

function useGroupedTasks(tasks: Task[]): Record<TaskStatus, Task[]> {
  return useMemo(() => {
    return _(tasks)
      .groupBy((task) => task.status)
      .mapValues((tasksWithStatus) =>
        _.sortBy(tasksWithStatus, (task) => task.sortKey)
      )
      .value() as Record<TaskStatus, Task[]>;
  }, [tasks]);
}

function orderBetweenTasks(
  taskAbove: Task | undefined,
  taskBelow: Task | undefined
): string {
  const [a, b] = [
    taskBelow?.sortKey ?? String(Date.now()),
    taskAbove?.sortKey ?? Between.lo,
  ].sort(Between.strord);

  if (a === b) return a;
  return Between.between(a, b);
}

export const TaskBoard: FC<Props> = ({ tasks, onChange }) => {
  const groupedTasks = useGroupedTasks(tasks);

  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    (result) => {
      if (result.reason !== "DROP" || !result.destination) return;

      const taskId = result.draggableId;
      const status = result.destination.droppableId as TaskStatus;

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

      const taskAbove = groupedTasks[status]?.[indexExcludingItself - 1];
      const taskBelow = groupedTasks[status]?.[indexExcludingItself];
      const sortKey = orderBetweenTasks(taskAbove, taskBelow);

      onChange(
        tasks.map((t) => (t.id === taskId ? { ...t, status, sortKey } : t))
      );
    },
    [tasks, groupedTasks, onChange]
  );

  const handleUpdateCard = useCallback(
    (updatedTask: Task) => {
      onChange(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    },
    [tasks, onChange]
  );
  const handleAddCard = useCallback(
    (task: Task) => onChange([...tasks, task]),
    [onChange, tasks]
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    resetServerContext();
    setLoaded(true);
  }, []);

  resetServerContext();
  if (!loaded) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Row className="dewo-task-board">
        <Space size="middle" align="start">
          {columns.map((status) => (
            <div key={status} style={{ width: columnWidth }}>
              <TaskBoardColumn
                status={status}
                tasks={groupedTasks[status] ?? noTasks}
                onChange={handleUpdateCard}
                onAdd={handleAddCard}
              />
            </div>
          ))}
        </Space>
      </Row>
    </DragDropContext>
  );
};
