import { OrganizationIntegrationType } from "@dewo/app/graphql/types";
import { Alert, Button, Popconfirm, Space } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import React, { FC, useMemo } from "react";
import { ConnectOrganizationToDiscordButton } from "../../integrations/discord/ConnectOrganizationToDiscordButton";
import { ConnectOrganizationToGithubButton } from "../../integrations/github/ConnectOrganizationToGithubButton";
import { CoordinapeToAdminPanelButton } from "../../integrations/coordinape/CoordinapeToAdminPanelButton";
import { useOrganizationIntegrations } from "../hooks";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { useDeleteOrganizationIntegration } from "../../auth/hooks";

interface Props {
  organizationId: string;
}

interface IntegrationInformation {
  name: string;
  component: JSX.Element;
}

export const OrganizationIntegrations: FC<Props> = ({ organizationId }) => {
  const integrations = useOrganizationIntegrations(organizationId);
  const types = useMemo(
    () => new Set(integrations?.map((i) => i.type)),
    [integrations]
  );
  const deleteOrganizationIntegration = useDeleteOrganizationIntegration();
  const [handleDeleteIntegration, deletingOrganizationIntegration] =
    useRunningCallback(deleteOrganizationIntegration, [
      deleteOrganizationIntegration,
    ]);

  const integrationsMapping: Record<
    OrganizationIntegrationType,
    IntegrationInformation
  > = {
    [OrganizationIntegrationType.DISCORD]: {
      name: "Discord",
      component: (
        <ConnectOrganizationToDiscordButton organizationId={organizationId} />
      ),
    },
    [OrganizationIntegrationType.GITHUB]: {
      name: "Github",
      component: (
        <ConnectOrganizationToGithubButton organizationId={organizationId} />
      ),
    },
    [OrganizationIntegrationType.COORDINAPE]: {
      name: "Coordinape",
      component: <CoordinapeToAdminPanelButton />,
    },
  };

  return (
    <Space direction="vertical">
      {(Object.keys(integrationsMapping) as OrganizationIntegrationType[]).map(
        (type) => {
          const integration = integrationsMapping[type];

          if (!types.has(type)) {
            return integration.component;
          } else {
            return (
              <Alert
                key={type}
                message={`Connected with ${integration.name}`}
                type="success"
                showIcon
                action={
                  <Popconfirm
                    icon={
                      <Icons.DeleteOutlined
                        style={{ color: Colors.grey.primary }}
                      />
                    }
                    title={`Disconnect ${integration.name}? This will also disconnect it from all your projects`}
                    okType="danger"
                    okText="Disconnect"
                    onConfirm={() => {
                      handleDeleteIntegration(type, organizationId);
                    }}
                  >
                    <Button
                      size="small"
                      type="text"
                      className="text-secondary"
                      loading={deletingOrganizationIntegration}
                      icon={<Icons.CloseOutlined />}
                    />
                  </Popconfirm>
                }
              />
            );
          }
        }
      )}
    </Space>
  );
};
