import React, { FC, useCallback, useMemo, useState } from "react";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { useProject } from "../hooks";
import {
  useOrganization,
  useOrganizationDiscordChannels,
} from "../../organization/hooks";
import { useToggle } from "@dewo/app/util/hooks";
import {
  useCreateDiscordProjectIntegration,
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

function useOrganizationDiscordIntegration(
  organizationId: string | undefined
): OrganizationIntegration | undefined {
  const organization = useOrganization(organizationId);
  return useMemo(
    () =>
      organization?.integrations.find(
        (i) => i.type === OrganizationIntegrationType.DISCORD
      ),
    [organization?.integrations]
  );
}

export const ProjectDiscordIntegration: FC<Props> = ({
  projectId,
  organizationId,
}) => {
  const { user } = useAuthContext();
  const router = useRouter();

  const project = useProject(projectId);
  const orgInt = useOrganizationDiscordIntegration(organizationId);
  const projInt = useMemo(
    () =>
      project?.integrations.find(
        (i) => i.type === ProjectIntegrationType.DISCORD
      ),
    [project?.integrations]
  );

  const discordChannels = useOrganizationDiscordChannels(
    { organizationId },
    !orgInt
  );
  const [selectedDiscordChannelId, setSelectedDiscordChannelId] =
    useState<string>();

  const loading = useToggle();
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
    // return (
    //   <ConnectToDiscordFormSection>
    //     <Input.Group compact style={{ display: "flex" }}>
    //       <ConnectProjectToDiscordSelect
    //         channels={discordChannels}
    //         organizationId={project.organizationId}
    //         allowClear
    //         style={{ flex: 1 }}
    //         onChange={setSelectedDiscordChannelId}
    //       />
    //       <Button
    //         loading={loading.isOn}
    //         disabled={!selectedDiscordChannelId}
    //         type="primary"
    //         onClick={handleConnect}
    //       >
    //         Connect
    //       </Button>
    //     </Input.Group>
    //   </ConnectToDiscordFormSection>
    // );
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
