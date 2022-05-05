import { Task, TaskStatus, TaskViewType } from "@dewo/app/graphql/types";
import React, { FC } from "react";
import { SkeletonTaskBoard } from "../board/SkeletonTaskBoard";
import { TaskBoard } from "../board/TaskBoard";
import { TaskBoardColumnEmptyProps } from "../board/TaskBoardColumnEmtpy";
import { TaskList } from "../list/TaskList";
import { useTaskViewContext } from "./TaskViewContext";
import styles from "./TaskViewLayout.module.less";

export const TaskViewLayout: FC<{
  tasks: Task[] | undefined;
  empty?: Record<TaskStatus, TaskBoardColumnEmptyProps>;
}> = ({ tasks, empty }) => {
  const { currentView } = useTaskViewContext();

  if (currentView?.type === TaskViewType.BOARD) {
    if (!tasks) return <SkeletonTaskBoard />;
    return <TaskBoard empty={empty} tasks={tasks} />;
  }

  return (
    <div style={{ width: "100%", height: "100%", overflowX: "hidden" }}>
      <TaskList className={styles.list} />
    </div>
  );
};
