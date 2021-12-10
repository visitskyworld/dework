import { CreateTaskInput } from "@dewo/app/graphql/types";
import React, { FC, useMemo } from "react";
import { useProjectTasks } from "../hooks";
import { TaskBoard } from "./TaskBoard";

interface Props {
  projectId: string;
}

export const ProjectTaskBoard: FC<Props> = ({ projectId }) => {
  const project = useProjectTasks(projectId, "cache-and-network");
  const initialValues = useMemo<Partial<CreateTaskInput>>(
    () => ({ projectId: project?.id }),
    [project?.id]
  );
  if (!project) return null;
  return (
    <TaskBoard
      tasks={project.tasks}
      tags={project.taskTags}
      initialValues={initialValues}
    />
  );
};
