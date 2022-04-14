import React, { FC, useCallback, useMemo, useState } from "react";
import { Button, Checkbox, Form, Select, Space, Image, Typography } from "antd";
import { useOrganizationDiscordChannels } from "../organization/hooks";
import { useForm } from "antd/lib/form/Form";
import { DiscordProjectIntegrationFeature } from "./hooks";
import { useToggle } from "@dewo/app/util/hooks";
import { DiscordIntegrationChannel } from "@dewo/app/graphql/types";
import _ from "lodash";
import { deworkSocialLinks } from "@dewo/app/util/constants";

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

const DiscordPermissionToString = {
  VIEW_CHANNEL: "View Channel",
  SEND_MESSAGES: "Send Messages",
  SEND_MESSAGES_IN_THREADS: "Send Messages in Threads",
  CREATE_PUBLIC_THREADS: "Create Public Threads",
  EMBED_LINKS: "Embed Links",
};

type DiscordPermission = keyof typeof DiscordPermissionToString;

const DiscordPermissionsForFeature: Partial<
  Record<DiscordProjectIntegrationFeature, DiscordPermission[]>
> = {
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL]: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "EMBED_LINKS",
  ],
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD]: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_MESSAGES_IN_THREADS",
    "EMBED_LINKS",
  ],
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK]: [
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_MESSAGES_IN_THREADS",
    "CREATE_PUBLIC_THREADS",
    "EMBED_LINKS",
  ],
};

export interface FormValues {
  discordChannelId: string;
  discordThreadId?: string;
  discordFeature: DiscordProjectIntegrationFeature;
  discordFeaturePostNewTasksEnabled?: boolean;
}

export interface CreateDiscordIntegrationFormValues {
  channel: DiscordIntegrationChannel;
  thread?: DiscordIntegrationChannel;
  features: DiscordProjectIntegrationFeature[];
}

interface Props {
  organizationId: string;
  onSubmit(values: CreateDiscordIntegrationFormValues): Promise<void>;
}

const initialValues: Partial<FormValues> = {
  discordFeature:
    DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
};

interface FormFieldProps {
  values: Partial<FormValues>;
  channels?: DiscordIntegrationChannel[];
  threads?: DiscordIntegrationChannel[];
  onRefetchChannels(): Promise<void>;
}

function useMissingPermissions(
  values: Partial<FormValues>,
  channels: DiscordIntegrationChannel[] | undefined
) {
  const requiredPermissions = useMemo(
    () =>
      !!values.discordFeature
        ? DiscordPermissionsForFeature[values.discordFeature]
        : [],
    [values.discordFeature]
  );
  const channel = useMemo(
    () => channels?.find((c) => c.id === values.discordChannelId),
    [channels, values.discordChannelId]
  );
  return useMemo(
    () =>
      _.difference(
        requiredPermissions,
        channel?.permissions ?? []
      ) as DiscordPermission[],
    [requiredPermissions, channel?.permissions]
  );
}

export const DiscordIntegrationFormFields: FC<FormFieldProps> = ({
  values,
  channels,
  threads,
  onRefetchChannels,
}) => {
  const showThreadSelect =
    values.discordFeature ===
    DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD;

  const channel = useMemo(
    () => channels?.find((c) => c.id === values.discordChannelId),
    [channels, values.discordChannelId]
  );
  const missingPermissions = useMissingPermissions(values, channels);

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
      <Form.Item
        name="discordChannelId"
        label="Post In"
        hidden={!values.discordFeature}
        rules={[
          {
            required: !!values.discordFeature,
            message: "Please select a Discord channel",
          },
          (form) => ({
            async validator() {
              if (!channel) return;
              if (!!missingPermissions.length) {
                throw new Error();
              }
            },
            message: (
              <>
                <Space style={{ marginTop: 2 }}>
                  <Typography.Text type="secondary">
                    Dework bot doesn't have the right permissions for this
                    channel. To fix this, follow these steps:
                    <ol>
                      <li>Go to the channel settings (NOT server settings)</li>
                      <li>
                        Add the bot Dework to the channel (not the role
                        'Dework')
                      </li>
                      <li>
                        Give Dework the following permissions:{" "}
                        {missingPermissions
                          .map((p) => DiscordPermissionToString[p])
                          .join(", ")}
                      </li>
                    </ol>
                  </Typography.Text>
                  <Button
                    size="small"
                    type="ghost"
                    onClick={async () => {
                      await onRefetchChannels();
                      form.setFields([
                        { name: "discordChannelId", errors: undefined },
                      ]);
                    }}
                  >
                    Retry
                  </Button>
                </Space>
                <Image width="100%" src="/discord/add-dework-bot.jpeg" />
              </>
            ),
          }),
        ]}
      >
        <Select
          loading={!channels}
          placeholder="Select Discord Channel..."
          allowClear
          showSearch
          optionFilterProp="label"
        >
          {channels?.map((channel) => (
            <Select.Option
              key={channel.id}
              value={channel.id}
              label={channel.name}
            >
              {`#${channel.name}`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
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
    values,
    discordChannels.value
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
