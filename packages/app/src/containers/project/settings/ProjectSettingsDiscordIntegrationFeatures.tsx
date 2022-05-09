import React, { FC, useCallback, useMemo } from "react";
import {
  OrganizationIntegrationType,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { useProjectIntegrations } from "../hooks";
import {
  DiscordProjectIntegrationFeature,
  useCreateDiscordProjectIntegration,
} from "../../integrations/hooks";
import { CreateDiscordIntegrationFeatureForm } from "../../integrations/discord/CreateDiscordIntegrationFeatureForm";
import {
  useOrganizationDiscordChannels,
  useOrganizationIntegrations,
} from "../../organization/hooks";
import { Typography, Card, Space } from "antd";
import { ConnectOrganizationToDiscordButton } from "../../integrations/discord/ConnectOrganizationToDiscordButton";
import { CreateDiscordIntegrationPayload } from "../../integrations/discord/CreateDiscordIntegrationForm";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectSettingsDiscordIntegrationFeatures: FC<Props> = ({
  projectId,
  organizationId,
}) => {
  const hasDiscordOrganizationIntegration = !!useOrganizationIntegrations(
    organizationId,
    OrganizationIntegrationType.DISCORD
  )?.length;
  const allProjectIntegrations = useProjectIntegrations(projectId);
  const discordProjectIntegrations = useMemo(
    () =>
      allProjectIntegrations?.filter(
        (i) => i.type === ProjectIntegrationType.DISCORD
      ),
    [allProjectIntegrations]
  );
  const { value: channels, refetch: onRefetchChannels } =
    useOrganizationDiscordChannels({ organizationId });

  const createIntegration = useCreateDiscordProjectIntegration();
  const handleSubmit = useCallback(
    async (values: CreateDiscordIntegrationPayload) => {
      await createIntegration({ projectId, ...values });
    },
    [createIntegration, projectId]
  );

  const copy = "Connect one or more integration types to your Discord server";

  return (
    <>
      {!!hasDiscordOrganizationIntegration ? (
        <Typography.Paragraph type="secondary">{copy}</Typography.Paragraph>
      ) : (
        <Card
          className="dewo-card-highlighted"
          bodyStyle={{
            display: "flex",
            alignItems: "center",
            padding: 12,
          }}
        >
          <ConnectOrganizationToDiscordButton
            organizationId={organizationId}
            type="primary"
            icon={null}
          >
            Connect Discord
          </ConnectOrganizationToDiscordButton>
          <Typography.Paragraph style={{ margin: 0, marginLeft: 12 }}>
            {copy}
          </Typography.Paragraph>
        </Card>
      )}

      <Space size="middle" direction="vertical" style={{ width: "100%" }}>
        {[
          DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
          DiscordProjectIntegrationFeature.POST_NEW_TASKS_TO_CHANNEL,
          DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE,
          // DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL,
        ].map((feature) => (
          <CreateDiscordIntegrationFeatureForm
            key={feature}
            feature={feature}
            organizationId={organizationId}
            channels={channels}
            disabled={!hasDiscordOrganizationIntegration}
            recommended={
              feature ===
              DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK
            }
            existingIntegration={discordProjectIntegrations?.find((i) =>
              i.config.features.includes(feature)
            )}
            onRefetchChannels={onRefetchChannels}
            onSubmit={handleSubmit}
          />
        ))}
      </Space>
    </>
  );
};
