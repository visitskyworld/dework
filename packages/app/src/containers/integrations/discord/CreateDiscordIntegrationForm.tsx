import React, { FC, useCallback, useMemo, useState } from "react";
import { Button, Checkbox, Form, Select, Typography } from "antd";
import {
  useOrganizationDiscordChannels,
  useOrganizationIntegrations,
} from "../../organization/hooks";
import { useForm } from "antd/lib/form/Form";
import {
  DiscordProjectIntegrationFeature,
  useMissingPermissions,
} from "../hooks";
import { useToggle } from "@dewo/app/util/hooks";
import { DiscordIntegrationChannel } from "@dewo/app/graphql/types";
import { deworkSocialLinks } from "@dewo/app/util/constants";
import { SelectDiscordChannelFormItem } from "./SelectDiscordChannelFormItem";

const DiscordProjectIntegrationFeatureLabel: Partial<
  Record<DiscordProjectIntegrationFeature, string>
> = {
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL]:
    "Post all task updates in one channel",
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD]:
    "Post all task updates in one specific channel thread",
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK]:
    "Create a thread per task (good for discussions)",
  [DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE]:
    "Post a status board message with all currently open tasks",
};

export interface FormValues {
  discordChannelId: string;
  discordThreadId?: string;
  discordFeature: DiscordProjectIntegrationFeature;
  discordFeaturePostNewTasksEnabled?: boolean;
}

export interface CreateDiscordIntegrationPayload {
  channel: DiscordIntegrationChannel;
  thread?: DiscordIntegrationChannel;
  features: DiscordProjectIntegrationFeature[];
}

interface Props {
  organizationId: string;
  onSubmit(payload: CreateDiscordIntegrationPayload): Promise<void>;
}

const initialValues: Partial<FormValues> = {
  discordFeature:
    DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
};

interface FormFieldProps {
  values: Partial<FormValues>;
  channels?: DiscordIntegrationChannel[];
  threads?: DiscordIntegrationChannel[];
  organizationId: string;
  onRefetchChannels(): Promise<void>;
}

export const DiscordIntegrationFormFields: FC<FormFieldProps> = ({
  values,
  channels,
  threads,
  organizationId,
  onRefetchChannels,
}) => {
  const showThreadSelect =
    values.discordFeature ===
    DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD;

  const channel = useMemo(
    () => channels?.find((c) => c.id === values.discordChannelId),
    [channels, values.discordChannelId]
  );
  const missingPermissions = useMissingPermissions(
    channels,
    values.discordFeature,
    values.discordChannelId
  );
  const integrations = useOrganizationIntegrations(organizationId);
  const guildId = useMemo(
    () =>
      channel?.integrationId &&
      integrations?.find((int) => int.id === channel.integrationId)?.config
        ?.guildId,
    [integrations, channel?.integrationId]
  );

  return (
    <>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
        Automatically create Discord threads to discuss Dework tasks.{" "}
        <a
          href={deworkSocialLinks.gitbook.connectingToDiscord}
          target="_blank"
          rel="noreferrer"
        >
          Read more here
        </a>
      </Typography.Paragraph>
      <Form.Item name="discordFeature">
        <Select
          loading={!channels}
          allowClear
          placeholder="Select Discord integration..."
        >
          {[
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL,
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD,
            DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE,
          ].map((type) => (
            <Select.Option key={type} value={type}>
              {DiscordProjectIntegrationFeatureLabel[type]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <SelectDiscordChannelFormItem
        guildId={guildId}
        organizationId={organizationId}
        channels={channels}
        missingPermissions={missingPermissions}
        feature={values.discordFeature}
        hidden={!values.discordFeature}
        onRefetchChannels={onRefetchChannels}
      />

      <Form.Item
        name="discordThreadId"
        label="Thread"
        hidden={!showThreadSelect}
        rules={[
          {
            required: showThreadSelect,
            message: "Please select a Discord thread",
          },
        ]}
      >
        <Select
          loading={!threads}
          placeholder="Select Discord Thread..."
          allowClear
          showSearch
          optionFilterProp="label"
        >
          {threads?.map((channel) => (
            <Select.Option
              key={channel.id}
              value={channel.id}
              label={channel.name}
            >
              {channel.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="discordFeaturePostNewTasksEnabled"
        hidden={!values.discordChannelId}
        valuePropName="checked"
        label="Publish New Tasks"
        tooltip="Good for creating awareness about new bounties. If not checked, you'll only get updates from tasks that have at least one assignee"
      >
        <Checkbox>
          Post all newly created tasks to{" "}
          <Typography.Text strong>{channel?.name}</Typography.Text>
        </Checkbox>
      </Form.Item>
    </>
  );
};

export const CreateDiscordIntegrationForm: FC<Props> = ({
  organizationId,
  onSubmit,
}) => {
  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<Partial<FormValues>>(initialValues);
  const handleChange = useCallback(
    (changed: Partial<FormValues>, values: Partial<FormValues>) => {
      if (!!changed.discordChannelId) values.discordThreadId = undefined;
      setValues(values);
      form.setFieldsValue(values);
      form.validateFields();
    },
    [form]
  );

  const discordChannels = useOrganizationDiscordChannels({ organizationId });
  const missingPermissions = useMissingPermissions(
    discordChannels.value,
    values.discordFeature,
    values.discordChannelId
  );
  const discordThreads = useOrganizationDiscordChannels(
    { organizationId, discordParentChannelId: values.discordChannelId },
    !values.discordChannelId || !!missingPermissions?.length
  );

  const submitting = useToggle();
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const channel = discordChannels.value?.find(
        (c) => c.id === values.discordChannelId
      );
      const thread = discordThreads.value?.find(
        (t) => t.id === values.discordThreadId
      );
      if (!channel) return;

      try {
        submitting.toggleOn();
        await onSubmit({
          channel,
          thread,
          features: [
            values.discordFeature,
            ...(values.discordFeaturePostNewTasksEnabled
              ? [DiscordProjectIntegrationFeature.POST_NEW_TASKS_TO_CHANNEL]
              : []),
          ],
        });
      } finally {
        submitting.toggleOff();
      }
    },
    [submitting, discordChannels.value, discordThreads.value, onSubmit]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onValuesChange={handleChange}
      onFinish={handleSubmit}
    >
      <DiscordIntegrationFormFields
        values={values}
        channels={discordChannels.value}
        threads={discordThreads.value}
        organizationId={organizationId}
        onRefetchChannels={discordChannels.refetch}
      />
      <Button
        type="primary"
        htmlType="submit"
        block
        loading={submitting.isOn}
        hidden={!values.discordFeature}
        disabled={!values.discordChannelId}
      >
        Connect Discord
      </Button>
    </Form>
  );
};
