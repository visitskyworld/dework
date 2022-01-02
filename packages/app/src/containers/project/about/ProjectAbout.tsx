import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectDetails } from "@dewo/app/graphql/types";
import React, { FC, useCallback, useState } from "react";
import { useUpdateProject } from "../hooks";

interface Props {
  project: ProjectDetails;
}

export const ProjectAbout: FC<Props> = ({ project }) => {
  const canUpdateProject = usePermission("update", "Project");
  const [description, setDescription] = useState(
    project.description ?? undefined
  );
  const updateProject = useUpdateProject();
  const handleSave = useCallback(
    () => updateProject({ id: project.id, description }),
    [updateProject, project.id, description]
  );

  return (
    <MarkdownEditor
      initialValue={description}
      editable={canUpdateProject}
      mode="update"
      onChange={setDescription}
      onSave={handleSave}
    />
  );
};