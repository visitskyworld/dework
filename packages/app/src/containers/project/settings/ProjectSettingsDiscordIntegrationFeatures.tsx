import React, { FC, Fragment, useCallback, useMemo } from "react";
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
import { Typography, Card, Space, Skeleton } from "antd";
import { ConnectOrganizationToDiscordButton } from "../../integrations/discord/ConnectOrganizationToDiscordButton";
import { CreateDiscordIntegrationPayload } from "../../integrations/discord/CreateDiscordIntegrationForm";

interface Props {
  projectId: string;
  organizationId: string;
}

interface IntegrationSection {
  title: string;
  features: DiscordProjectIntegrationFeature[];
}

const sections: IntegrationSection[] = [
  {
    title: "Good for Discussions",
    features: [
      DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
    ],
  },
  {
    title: "Tasks Awareness",
    features: [
      DiscordProjectIntegrationFeature.POST_NEW_TASKS_TO_CHANNEL,
      DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE,
    ],
  },
  {
    title: "Community Suggestions",
    features: [
      DiscordProjectIntegrationFeature.POST_COMMUNITY_SUGGESTIONS_STATUS_BOARD_MESSAGE,
    ],
  },
];

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
    <Skeleton loading={!discordProjectIntegrations}>
      <Space size="middle" direction="vertical" style={{ width: "100%" }}>
        {!!hasDiscordOrganizationIntegration ? (
          <Typography.Paragraph type="secondary">{copy}</Typography.Paragraph>
        ) : (
          <Card
            className="dewo-card-highlighted"
            bodyStyle={{ display: "flex", alignItems: "center", padding: 12 }}
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
        {sections.map((section, index) => (
          <Fragment key={index}>
            <Typography.Title level={5} style={{ marginTop: 8 }}>
              {section.title}
            </Typography.Title>
            {section.features.map((feature) => (
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
          </Fragment>
        ))}
      </Space>
    </Skeleton>
  );
};
