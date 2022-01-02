import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectDetails } from "@dewo/app/graphql/types";
import React, { FC, useCallback } from "react";
import { useUpdateProject } from "../hooks";

interface Props {
  project: ProjectDetails;
}

export const ProjectAbout: FC<Props> = ({ project }) => {
  const canUpdateProject = usePermission("update", "Project");
  const updateProject = useUpdateProject();
  const handleSave = useCallback(
    (description: string) => updateProject({ id: project.id, description }),
    [updateProject, project.id]
  );

  return (
    <MarkdownEditor
      initialValue={project.description ?? undefined}
      editable={canUpdateProject}
      mode="update"
      onSave={handleSave}
    />
  );
};
