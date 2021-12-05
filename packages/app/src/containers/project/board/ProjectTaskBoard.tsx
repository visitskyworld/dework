import { CreateTaskInput } from "@dewo/app/graphql/types";
import React, { FC, useMemo } from "react";
import { useProject } from "../hooks";
import { TaskBoard } from "./TaskBoard";

interface Props {
  projectId: string;
}

export const ProjectTaskBoard: FC<Props> = ({ projectId }) => {
  const project = useProject(projectId);
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
