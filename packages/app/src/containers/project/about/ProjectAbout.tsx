import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectDetails } from "@dewo/app/graphql/types";
import { Space, Typography } from "antd";
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

  return project.description ? (
    <MarkdownEditor
      initialValue={project.description ?? undefined}
      editable={canUpdateProject}
      mode="update"
      onSave={handleSave}
    />
  ) : (
    <div>
      <Typography.Title
        level={4}
        style={{ borderBottom: "1px solid white", paddingBottom: 10 }}
      >
        Insert your project description here
      </Typography.Title>
      <ul>
        <Space direction="vertical" size={16}>
          <li>
            <Typography.Text type="secondary">
              Embed any links, files or images that are descriptive of the
              project
            </Typography.Text>
          </li>
          <li>
            <Typography.Text type="secondary">
              Maybe even a FAQ about the project
            </Typography.Text>
          </li>
        </Space>
      </ul>
    </div>
  );
};
