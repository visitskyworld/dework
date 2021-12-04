import React, { createContext, FC, useContext, useMemo } from "react";
import { useProject } from "../containers/project/hooks";
import { Project } from "../graphql/types";

const ProjectContext = createContext<Project | undefined>(undefined);

interface ProjectProviderProps {
  id: string;
}

export const ProjectProvider: FC<ProjectProviderProps> = ({ children, id }) => {
  const project = useProject(id);
  return (
    <ProjectContext.Provider value={project}>
      {useMemo(() => children, [children])}
    </ProjectContext.Provider>
  );
};

export function useProjectContext(): Project | undefined {
  return useContext(ProjectContext);
}
