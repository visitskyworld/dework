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
import { Alert, Typography } from "antd";
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
  const integrations = useProjectIntegrations(projectId);
  const projInt = useMemo(
    () => integrations?.find((i) => i.type === ProjectIntegrationType.DISCORD),
    [integrations]
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
    () =>
      updateIntegration({
        id: projInt!.id,
        deletedAt: new Date().toISOString(),
      }),
    [projInt, updateIntegration]
  );

  if (!!projInt && !!discordIntegration) {
    return (
      <FormSection label="Discord Integration">
        <Alert
          message={
            <Typography.Text>
              Connected to{" "}
              <Link
                href={`https://discord.com/channels/${discordIntegration.config?.guildId}/${projInt.config.channelId}`}
              >
                <a target="_blank">
                  <Typography.Text strong>
                    {projInt.config.name}
                  </Typography.Text>
                </a>
              </Link>
            </Typography.Text>
          }
          type="success"
          showIcon
          closable
          onClose={removeIntegration}
        />
      </FormSection>
    );
  }

  if (!!discordIntegration) {
    return (
      <CreateDiscordIntegrationForm
        organizationId={organizationId}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ConnectToDiscordFormSection>
      <ConnectOrganizationToDiscordButton
        organizationId={organizationId}
        type="ghost"
      />
    </ConnectToDiscordFormSection>
  );
};
