import { TaskViewType } from "@dewo/app/graphql/types";
import React, { FC } from "react";
import { ProjectTaskBoard } from "../../project/board/ProjectTaskBoard";
import { TaskList } from "../list/TaskList";
import { useTaskViewContext } from "./TaskViewContext";
import styles from "./TaskViewTabs.module.less";

export const TaskViewLayout: FC = () => {
  const { currentView } = useTaskViewContext();
  if (!currentView) return null;
  if (currentView.type === TaskViewType.BOARD) {
    return <ProjectTaskBoard projectId={currentView.projectId} />;
  }

  return (
    <div style={{ width: "100%", height: "100%", overflowX: "hidden" }}>
      <TaskList className={styles.list} />
    </div>
  );
};
