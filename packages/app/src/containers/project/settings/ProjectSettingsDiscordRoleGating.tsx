import { ProjectDetails } from "@dewo/app/graphql/types";
import { Divider, Typography } from "antd";
import React, { FC } from "react";
import { useOrganizationDiscordIntegration } from "../../integrations/hooks";
import { ProjectSettingsDiscordRoleGatingRow } from "./ProjectSettingsDiscordRoleGatingRow";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsDiscordRoleGating: FC<Props> = ({ project }) => {
  const orgInt = useOrganizationDiscordIntegration(project.organizationId);

  return (
    <>
      <Divider />
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Discord Role Gating
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Allow your community join this project as project contributor or
        steward, depending on their Discord role.
      </Typography.Paragraph>
      {!orgInt && (
        <Typography.Paragraph type="secondary">
          First, connect with Discord. (TODO connect flow...)
        </Typography.Paragraph>
      )}

      <ProjectSettingsDiscordRoleGatingRow
        organizationId={project.organizationId}
      />
    </>
  );
};
