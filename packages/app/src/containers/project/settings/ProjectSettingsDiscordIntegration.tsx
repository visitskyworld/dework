import React, { FC } from "react";
import { Typography, Divider } from "antd";
import { ProjectDetails } from "@dewo/app/graphql/types";
import { ProjectSettingsDiscordIntegrationFeatures } from "./ProjectSettingsDiscordIntegrationFeatures";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsDiscordIntegration: FC<Props> = ({ project }) => (
  <>
    <Typography.Title level={4} style={{ marginBottom: 4 }}>
      Discord Integration
    </Typography.Title>

    <Divider style={{ marginTop: 0 }} />

    <ProjectSettingsDiscordIntegrationFeatures
      projectId={project.id}
      organizationId={project.organizationId}
    />
  </>
);
