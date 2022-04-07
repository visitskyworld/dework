import React, { FC, useCallback, useMemo } from "react";
import {
  OrganizationIntegrationType,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { useProjectIntegrations } from "../hooks";
import {
  useCreateDiscordProjectIntegration,
  useUpdateProjectIntegration,
} from "../../integrations/hooks";
import { FormSection } from "@dewo/app/components/FormSection";
import { Alert, Space, Typography } from "antd";
import Link from "next/link";
import { ConnectToDiscordFormSection } from "../../integrations/ConnectToDiscordFormSection";
import {
  CreateDiscordIntegrationForm,
  CreateDiscordIntegrationFormValues,
} from "../../integrations/CreateDiscordIntegrationForm";
import { ConnectOrganizationToDiscordButton } from "../../integrations/buttons/ConnectOrganizationToDiscordButton";
import { useOrganizationIntegrations } from "../../organization/hooks";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectSettingsDiscordIntegration: FC<Props> = ({
  projectId,
  organizationId,
}) => {
  const discordIntegration = useOrganizationIntegrations(
    organizationId,
    OrganizationIntegrationType.DISCORD
  )?.[0];
  const allIntegrations = useProjectIntegrations(projectId);
  const discordIntegrations = useMemo(
    () =>
      allIntegrations?.filter((i) => i.type === ProjectIntegrationType.DISCORD),
    [allIntegrations]
  );

  const createIntegration = useCreateDiscordProjectIntegration();
  const handleSubmit = useCallback(
    async (values: CreateDiscordIntegrationFormValues) => {
      await createIntegration({ projectId, ...values });
    },
    [createIntegration, projectId]
  );

  const updateIntegration = useUpdateProjectIntegration();
  const removeIntegration = useCallback(
    (id: string) =>
      updateIntegration({ id, deletedAt: new Date().toISOString() }),
    [updateIntegration]
  );

  if (!discordIntegration) {
    return (
      <ConnectToDiscordFormSection>
        <ConnectOrganizationToDiscordButton
          organizationId={organizationId}
          type="ghost"
        />
      </ConnectToDiscordFormSection>
    );
  }

  return (
    <FormSection label="Discord Integration">
      <Space direction="vertical" style={{ width: "100%" }}>
        {discordIntegrations?.map((integration) => (
          <Alert
            key={integration.id}
            message={
              <Typography.Text>
                Connected to{" "}
                <Link
                  href={`https://discord.com/channels/${discordIntegration.config?.guildId}/${integration.config.channelId}`}
                >
                  <a target="_blank">
                    <Typography.Text strong>
                      {integration.config.name}
                    </Typography.Text>
                  </a>
                </Link>
              </Typography.Text>
            }
            type="success"
            showIcon
            closable
            onClose={() => removeIntegration(integration.id)}
          />
        ))}
        <CreateDiscordIntegrationForm
          organizationId={organizationId}
          onSubmit={handleSubmit}
        />
      </Space>
    </FormSection>
  );
};
