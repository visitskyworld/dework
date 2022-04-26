import { CoordinapeIcon } from "@dewo/app/components/icons/Coordinape";
import { OrganizationIntegrationType } from "@dewo/app/graphql/types";
import { Alert, Button, Space, Tooltip } from "antd";
import React, { FC, useMemo } from "react";
import { ConnectOrganizationToDiscordButton } from "../../integrations/discord/ConnectOrganizationToDiscordButton";
import { ConnectOrganizationToGithubButton } from "../../integrations/github/ConnectOrganizationToGithubButton";
import { useOrganizationIntegrations } from "../hooks";

interface Props {
  organizationId: string;
}

export const OrganizationIntegrations: FC<Props> = ({ organizationId }) => {
  const integrations = useOrganizationIntegrations(organizationId);
  const types = useMemo(
    () => new Set(integrations?.map((i) => i.type)),
    [integrations]
  );

  return (
    <Space direction="vertical">
      {types.has(OrganizationIntegrationType.DISCORD) ? (
        <Alert message="Discord Connected" type="success" showIcon />
      ) : (
        <ConnectOrganizationToDiscordButton
          organizationId={organizationId}
          type="ghost"
        />
      )}
      {types.has(OrganizationIntegrationType.GITHUB) ? (
        <Alert message="Github Connected" type="success" showIcon />
      ) : (
        <ConnectOrganizationToGithubButton
          organizationId={organizationId}
          type="ghost"
        />
      )}
      {types.has(OrganizationIntegrationType.COORDINAPE) ? (
        <Alert message="Coordinape Connected" type="success" showIcon />
      ) : (
        <Tooltip
          title={`Open "Settings" in the Coordinape Circle Admin page to connect Dework`}
        >
          <Button
            icon={<CoordinapeIcon />}
            type="ghost"
            href="https://app.coordinape.com/admin"
            target="_blank"
          >
            Connect to Coordinape
          </Button>
        </Tooltip>
      )}
    </Space>
  );
};
