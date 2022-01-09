import React, { FC } from "react";
import { TaskList } from "../../task/list/TaskList";
import { useProjectTasks, useProjectTaskTags } from "../hooks";

interface Props {
  projectId: string;
}

export const ProjectTaskList: FC<Props> = ({ projectId }) => {
  const tags = useProjectTaskTags(projectId);
  const tasks = useProjectTasks(projectId, "cache-and-network")?.tasks;
  if (!tasks) return null;
  return (
    <TaskList
      tasks={tasks}
      tags={tags}
      projectId={projectId}
      style={{ marginLeft: 24, marginRight: 24, minWidth: 480, maxWidth: 960 }}
    />
  );
};
