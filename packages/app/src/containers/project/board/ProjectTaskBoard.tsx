import React, { FC } from "react";
import { useProjectTasks } from "../hooks";
import { TaskBoard } from "./TaskBoard";

interface Props {
  projectId: string;
}

export const ProjectTaskBoard: FC<Props> = ({ projectId }) => {
  const project = useProjectTasks(projectId, "cache-and-network");
  if (!project) return null;
  return (
    <TaskBoard
      tasks={project.tasks}
      tags={project.taskTags}
      projectId={projectId}
    />
  );
};
