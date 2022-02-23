import React, { FC, useCallback, useMemo } from "react";
import { ProjectIntegrationType } from "@dewo/app/graphql/types";
import { useProject } from "../hooks";
import {
  useCreateDiscordProjectIntegration,
  useOrganizationDiscordIntegration,
  useUpdateProjectIntegration,
} from "../../integrations/hooks";
import { FormSection } from "@dewo/app/components/FormSection";
import { Alert, Button, Typography } from "antd";
import Link from "next/link";
import { Constants } from "@dewo/app/util/constants";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { useRouter } from "next/router";
import { ConnectToDiscordFormSection } from "../../integrations/ConnectToDiscordFormSection";
import {
  CreateDiscordIntegrationForm,
  CreateDiscordIntegrationFormValues,
} from "../../integrations/CreateDiscordIntegrationForm";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectSettingsDiscordIntegration: FC<Props> = ({
  projectId,
  organizationId,
}) => {
  const { user } = useAuthContext();
  const router = useRouter();

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
      <Button
        type="ghost"
        style={{ marginTop: 4 }}
        icon={<DiscordIcon />}
        href={`${
          Constants.GRAPHQL_API_URL
        }/auth/discord-bot?organizationId=${organizationId}&userId=${
          user!.id
        }&redirect=${router.asPath}`}
      >
        Connect to Discord
      </Button>
    </ConnectToDiscordFormSection>
  );
};
