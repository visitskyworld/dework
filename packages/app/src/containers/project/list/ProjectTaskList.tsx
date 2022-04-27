import React, { CSSProperties, FC } from "react";
import { useProjectTasks } from "../hooks";

import { TaskList } from "../../task/list/TaskList";
import { Spin } from "antd";

interface Props {
  projectId?: string;
  style?: CSSProperties;
  className?: string;
}

export const ProjectTaskList: FC<Props> = ({ projectId, style, className }) => {
  const tasks = useProjectTasks(projectId, "cache-and-network");
  return tasks ? (
    <TaskList
      tasks={tasks}
      projectId={projectId}
      style={style}
      className={className}
    />
  ) : (
    <div style={{ display: "grid", placeItems: "center", padding: 20 }}>
      <Spin />
    </div>
  );
};
