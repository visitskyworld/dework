import { ProjectDetails } from "@dewo/app/graphql/types";
import { Typography, Divider } from "antd";
import React, { FC } from "react";
import { ProjectSettingsGithubIntegrationFeatures } from "./ProjectSettingsGithubIntegrationFeatures";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsGithubIntegration: FC<Props> = ({ project }) => (
  <>
    <Typography.Title level={4} style={{ marginBottom: 4 }}>
      Github Integration
    </Typography.Title>

    <Divider style={{ marginTop: 0 }} />

    <ProjectSettingsGithubIntegrationFeatures
      projectId={project.id}
      organizationId={project.organizationId}
    />
  </>
);
