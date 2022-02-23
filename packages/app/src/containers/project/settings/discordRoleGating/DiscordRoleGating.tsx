import {
  ProjectDetails,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { Divider, Row, Typography } from "antd";
import React, { FC, useMemo } from "react";
import { useOrganizationDiscordIntegration } from "../../../integrations/hooks";
import { CreateDiscordRoleGateForm } from "./CreateDiscordRoleGateForm";
import { DiscordRoleGateSummary } from "./DiscordRoleGateSummary";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsDiscordRoleGating: FC<Props> = ({ project }) => {
  const orgInt = useOrganizationDiscordIntegration(project.organizationId);
  const projectIntegrations = useMemo(
    () =>
      project.integrations.filter(
        (i) => i.type === ProjectIntegrationType.DISCORD_ROLE_GATE
      ),
    [project.integrations]
  );

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
      {!orgInt ? (
        <Typography.Paragraph type="secondary">
          First, connect with Discord. (TODO connect flow...)
        </Typography.Paragraph>
      ) : (
        <Row style={{ gap: 16, width: "100%" }}>
          {projectIntegrations.map((integration) => (
            <DiscordRoleGateSummary
              key={integration.id}
              integration={integration}
              project={project}
            />
          ))}
          <CreateDiscordRoleGateForm
            key={projectIntegrations.length}
            projectId={project.id}
            organizationId={project.organizationId}
            organizationIntegrationId={orgInt.id}
          />
        </Row>
      )}
    </>
  );
};
