import React, { FC, useCallback, useMemo, useState } from "react";
import { Select, Typography, Row, Col, Button, Alert } from "antd";
import { useRouter } from "next/router";
import { useUser } from "@dewo/app/util/hooks";
import {
  CreateProjectIntegrationMutation,
  CreateProjectIntegrationMutationVariables,
  DiscordListChannelsQuery,
  DiscordListChannelsQueryVariables,
  DiscordListGuildsQuery,
  GetProjectIntegrationsQuery,
  GetProjectIntegrationsQueryVariables,
  ProjectIntegrationSource,
  ThreepidSource,
} from "@dewo/app/graphql/types";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { useMutation, useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import * as Mutations from "@dewo/app/graphql/mutations";
import { Constants } from "@dewo/app/util/constants";

const PostNewTasksToDiscordIntegration: FC = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  const [selectedGuildId, setSelectedGuildId] = useState<string>();
  const [selectedChannelId, setSelectedChannelId] = useState<string>();

  const guilds = useQuery<DiscordListGuildsQuery>(Queries.discordListGuilds);
  const channels = useQuery<
    DiscordListChannelsQuery,
    DiscordListChannelsQueryVariables
  >(Queries.discordListChannels, {
    variables: { discordGuildId: selectedGuildId! },
    skip: !selectedGuildId,
  });

  const integrations = useQuery<
    GetProjectIntegrationsQuery,
    GetProjectIntegrationsQueryVariables
  >(Queries.projectIntegrations, { variables: { projectId } }).data?.project
    .integrations;

  const hasIntegration = useMemo(
    () =>
      integrations?.some(
        (i) =>
          i.source === ProjectIntegrationSource.discord &&
          (i.config as any).features?.includes("POST_CREATED_TASKS")
      ),
    [integrations]
  );

  const [createIntegrationMutation, { loading: creatingIntegration }] =
    useMutation<
      CreateProjectIntegrationMutation,
      CreateProjectIntegrationMutationVariables
    >(Mutations.createProjectIntegration);
  const createIntegration = useCallback(async () => {
    await createIntegrationMutation({
      variables: {
        input: {
          projectId,
          source: ProjectIntegrationSource.discord,
          config: {
            guildId: selectedGuildId!,
            channelId: selectedChannelId!,
            // features: [DiscordProjectIntegrationFeature.POST_CREATED_TASKS],
            features: ["POST_CREATED_TASKS"],
          },
        },
      },
    });
  }, [
    createIntegrationMutation,
    projectId,
    selectedChannelId,
    selectedGuildId,
  ]);

  if (!guilds) return null;
  return (
    <>
      <Typography.Paragraph strong>
        Post New Tasks to Discord
      </Typography.Paragraph>
      <Row gutter={8}>
        <Col span={9}>
          <Select<string>
            style={{ width: "100%" }}
            value={selectedGuildId}
            disabled={guilds.loading || hasIntegration}
            loading={guilds.loading}
            placeholder="Select Guild..."
            onChange={setSelectedGuildId}
          >
            {guilds.data?.guilds.map((guild) => (
              <Select.Option key={guild.id} value={guild.id} label={guild.name}>
                {guild.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={9}>
          <Select<string>
            style={{ width: "100%" }}
            value={selectedChannelId}
            disabled={!selectedGuildId || channels.loading || hasIntegration}
            loading={channels.loading}
            placeholder="Select Channel..."
            onChange={setSelectedChannelId}
          >
            {channels.data?.channels.map((channel) => (
              <Select.Option
                key={channel.id}
                value={channel.id}
                label={channel.name}
              >
                {channel.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          {hasIntegration ? (
            <Alert message="Set up" type="success" showIcon />
          ) : (
            <Button
              disabled={!selectedGuildId || !selectedChannelId}
              type="primary"
              loading={creatingIntegration}
              block
              onClick={createIntegration}
            >
              Enable
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

export const ProjectDiscordIntegrations: FC = () => {
  const user = useUser();
  const discordConnected = useMemo(
    () => user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user?.threepids]
  );

  if (!discordConnected) {
    const redirect = typeof window !== undefined ? window.location.href : "";
    return (
      <Button
        size="large"
        type="primary"
        block
        icon={<DiscordIcon />}
        href={`${Constants.API_URL}/auth/discord?redirect=${redirect}`}
      >
        Connect Discord
      </Button>
    );
  }

  return <PostNewTasksToDiscordIntegration />;
};
