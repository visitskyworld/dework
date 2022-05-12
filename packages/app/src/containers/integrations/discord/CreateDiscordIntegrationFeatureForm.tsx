import React, { useCallback, useMemo, useState } from "react";
import { Button, Form, Tag, Typography } from "antd";
import {
  DiscordIntegrationChannel,
  OrganizationIntegrationType,
  ProjectIntegration,
} from "@dewo/app/graphql/types";
import {
  DiscordProjectIntegrationFeature,
  useMissingPermissions,
  useUpdateProjectIntegration,
} from "../hooks";
import {
  CreateDiscordIntegrationPayload,
  FormValues,
} from "./CreateDiscordIntegrationForm";
import { useRunningCallback, useToggle } from "@dewo/app/util/hooks";
import { useForm } from "antd/lib/form/Form";
import { useOrganizationIntegrations } from "../../organization/hooks";
import { CreateIntegrationFeatureCard } from "../CreateIntegrationFeatureCard";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { SelectDiscordChannelFormItem } from "./SelectDiscordChannelFormItem";
import { deworkSocialLinks } from "@dewo/app/util/constants";

const DiscordProjectIntegrationFeatureTitle: Partial<
  Record<DiscordProjectIntegrationFeature, string>
> = {
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK]:
    "Create a thread when a task is assigned to someone",
  [DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE]:
    "Post a status board with all open tasks",
  [DiscordProjectIntegrationFeature.POST_NEW_TASKS_TO_CHANNEL]:
    "Send a message when a task is created",
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL]:
    "Post all task updates in one channel",
};

interface Props {
  organizationId: string;
  recommended?: boolean;
  feature: DiscordProjectIntegrationFeature;
  channels?: DiscordIntegrationChannel[];
  existingIntegration: ProjectIntegration | undefined;
  disabled?: boolean;
  onRefetchChannels: () => Promise<void>;
  onSubmit(payload: CreateDiscordIntegrationPayload): Promise<void>;
}

export const CreateDiscordIntegrationFeatureForm = ({
  organizationId,
  feature,
  channels,
  existingIntegration,
  disabled = false,
  recommended,
  onRefetchChannels,
  onSubmit,
}: Props) => {
  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<Partial<FormValues>>({});

  const expanded = useToggle(recommended && !disabled);

  const integrations = useOrganizationIntegrations(
    organizationId,
    OrganizationIntegrationType.DISCORD
  );
  const channel = useMemo(
    () => channels?.find((c) => c.id === values.discordChannelId),
    [channels, values.discordChannelId]
  );
  const guildId = useMemo(
    () =>
      channel?.integrationId &&
      integrations?.find((int) => int.id === channel.integrationId)?.config
        ?.guildId,
    [integrations, channel?.integrationId]
  );
  const missingPermissions = useMissingPermissions(
    channels,
    feature,
    values.discordChannelId
  );

  const handleChange = useCallback((_, values: Partial<FormValues>) => {
    setValues(values);
  }, []);
  const updateIntegration = useUpdateProjectIntegration();
  const [handleDisconnect, disconnecting] = useRunningCallback(async () => {
    try {
      await updateIntegration({
        id: existingIntegration?.id!,
        deletedAt: new Date().toISOString(),
      });
    } finally {
      form.resetFields();
    }
  }, [form, existingIntegration, updateIntegration]);
  const [handleSubmit, submitting] = useRunningCallback(
    async (values: FormValues) => {
      const channel = channels?.find((c) => c.id === values.discordChannelId);
      if (!channel) return;

      await onSubmit({
        channel,
        features: [feature],
      });
    },
    [channels, feature, onSubmit]
  );

  return (
    <CreateIntegrationFeatureCard
      headerTitle={DiscordProjectIntegrationFeatureTitle[feature]}
      headerIcon={<DiscordIcon />}
      isConnected={!!existingIntegration}
      connectedButtonCopy={`Connected to #${existingIntegration?.config.name}`}
      disabled={disabled}
      expanded={expanded}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
          {recommended && <Tag color="green">Recommended!</Tag>}
          Learn more about this integration{" "}
          <a
            href={deworkSocialLinks.gitbook.connectingToDiscord}
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </Typography.Paragraph>
        {!!existingIntegration ? (
          <Button
            loading={disconnecting}
            hidden={!existingIntegration}
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        ) : (
          <>
            <SelectDiscordChannelFormItem
              guildId={guildId}
              organizationId={organizationId}
              channels={channels}
              missingPermissions={missingPermissions}
              feature={feature}
              disabled={!!existingIntegration}
              onRefetchChannels={onRefetchChannels}
            />
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              hidden={!!existingIntegration}
              disabled={!values.discordChannelId}
            >
              Connect
            </Button>
          </>
        )}
      </Form>
    </CreateIntegrationFeatureCard>
  );
};
