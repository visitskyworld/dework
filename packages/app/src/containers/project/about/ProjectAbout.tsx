import { RichMarkdownEditor } from "@dewo/app/components/richMarkdownEditor/RichMarkdownEditor";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectDetails } from "@dewo/app/graphql/types";
import React, { FC, useCallback } from "react";
import { useUpdateProject } from "../hooks";

interface Props {
  project: ProjectDetails;
}

export const ProjectAbout: FC<Props> = ({ project }) => {
  const canUpdateProject = usePermission("update", project);
  const updateProject = useUpdateProject();
  const handleSave = useCallback(
    (description: string) => updateProject({ id: project.id, description }),
    [updateProject, project.id]
  );
  const initialValue = `## Insert your project description here
- Embed any links, files or images that are descriptive of the project
- Maybe even a FAQ about the project`;

  return (
    <RichMarkdownEditor
      initialValue={project.description || initialValue}
      editable={canUpdateProject || false}
      mode="update"
      onSave={handleSave}
    />
  );
};
