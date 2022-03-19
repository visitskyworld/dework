import React, { FC, useCallback, useMemo } from "react";
import { ProjectIntegrationType } from "@dewo/app/graphql/types";
import { useProject } from "../hooks";
import {
  useCreateDiscordProjectIntegration,
  useOrganizationDiscordIntegration,
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
import { ConnectOrganizationToDiscordButton } from "../../integrations/ConnectOrganizationToDiscordButton";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectSettingsDiscordIntegration: FC<Props> = ({
  projectId,
  organizationId,
}) => {
  const { project } = useProject(projectId);
  const orgInt = useOrganizationDiscordIntegration(organizationId);
  const projInt = useMemo(
    () =>
      project?.integrations.find(
        (i) => i.type === ProjectIntegrationType.DISCORD
      ),
    [project?.integrations]
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

  if (!project) return null;
  if (!!projInt && !!orgInt) {
    return (
      <FormSection label="Discord Integration">
        <Alert
          message={
            <Typography.Text>
              Connected to{" "}
              <Link
                href={`https://discord.com/channels/${orgInt.config.guildId}/${projInt.config.channelId}`}
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

  if (!!orgInt) {
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
