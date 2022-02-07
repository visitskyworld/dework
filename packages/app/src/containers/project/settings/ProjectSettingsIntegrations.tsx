import { ProjectDetails } from "@dewo/app/graphql/types";
import { Typography, Divider, Space } from "antd";
import React, { FC } from "react";
import { ProjectSettingsDiscordIntegration } from "./ProjectSettingsDiscordIntegration";
import { ProjectSettingsGithubIntegration } from "./ProjectSettingsGithubIntegration";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsIntegrations: FC<Props> = ({ project }) => (
  <>
    <Typography.Title level={4} style={{ marginBottom: 4 }}>
      Integrations
    </Typography.Title>

    <Divider style={{ marginTop: 0 }} />

    <Space direction="vertical" size="large">
      <ProjectSettingsDiscordIntegration
        projectId={project.id}
        organizationId={project.organizationId}
      />
      <ProjectSettingsGithubIntegration
        projectId={project.id}
        organizationId={project.organizationId}
      />
    </Space>
  </>
);
