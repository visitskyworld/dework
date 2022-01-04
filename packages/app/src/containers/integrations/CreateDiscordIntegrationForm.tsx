import React, { FC, useCallback, useState } from "react";
import { Button, Col, Form, Row, Select, Typography } from "antd";
import { useOrganizationDiscordChannels } from "../organization/hooks";
import { useForm } from "antd/lib/form/Form";
import { DiscordProjectIntegrationFeature } from "./hooks";
import { useToggle } from "@dewo/app/util/hooks";
import { DiscordIntegrationChannel } from "@dewo/app/graphql/types";

const DiscordProjectIntegrationFeatureLabel: Record<
  DiscordProjectIntegrationFeature,
  string
> = {
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL]:
    "Post all task updates in one channel",
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD]:
    "Post all task updates in one specific channel thread",
  [DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK]:
    "Create a thread per task (good for discussions)",
};

interface FormValues {
  channelId: string;
  threadId?: string;
  feature: DiscordProjectIntegrationFeature;
}

export interface CreateDiscordIntegrationFormValues {
  channel: DiscordIntegrationChannel;
  thread?: DiscordIntegrationChannel;
  feature: DiscordProjectIntegrationFeature;
}

interface Props {
  organizationId: string;
  onSubmit(values: CreateDiscordIntegrationFormValues): Promise<void>;
}

const initialValues: Partial<FormValues> = {
  feature:
    DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
};

export const CreateDiscordIntegrationForm: FC<Props> = ({
  organizationId,
  onSubmit,
}) => {
  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<Partial<FormValues>>(initialValues);
  const handleChange = useCallback(
    (changed: Partial<FormValues>, values: Partial<FormValues>) => {
      if (!!changed.channelId) values.threadId = undefined;
      setValues(values);
      form.setFieldsValue(values);
    },
    [form]
  );

  const discordChannels = useOrganizationDiscordChannels({ organizationId });
  const discordThreads = useOrganizationDiscordChannels(
    { organizationId, discordParentChannelId: values.channelId },
    !values.channelId
  );

  const showThreadSelect =
    values.feature ===
    DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD;

  const submitting = useToggle();
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const channel = discordChannels?.find((c) => c.id === values.channelId);
      const thread = discordThreads?.find((t) => t.id === values.threadId);
      if (!channel) return;

      try {
        submitting.toggleOn();
        await onSubmit({ channel, thread, feature: values.feature });
      } finally {
        submitting.toggleOff();
      }
    },
    [submitting, discordChannels, discordThreads, onSubmit]
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
      <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
        Want to automatically create Discord threads to discuss Dework tasks?
        Try out the Discord integration for this project!
      </Typography.Paragraph>
      <Form.Item name="feature">
        <Select loading={!discordChannels}>
          {[
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL,
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD,
          ].map((type) => (
            <Select.Option key={type} value={type}>
              {DiscordProjectIntegrationFeatureLabel[type]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Row gutter={8}>
        <Col span={showThreadSelect ? 12 : 24}>
          <Form.Item
            name="channelId"
            label="Post In"
            rules={[
              { required: true, message: "Please select a Discord channel" },
            ]}
          >
            <Select
              loading={!discordChannels}
              placeholder="Select Discord Channel..."
            >
              {discordChannels?.map((channel) => (
                <Select.Option key={channel.id} value={channel.id}>
                  {`#${channel.name}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="threadId"
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
              loading={!discordThreads}
              placeholder="Select Discord Thread..."
            >
              {discordThreads?.map((channel) => (
                <Select.Option key={channel.id} value={channel.id}>
                  {channel.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Button
        type="primary"
        htmlType="submit"
        block
        loading={submitting.isOn}
        hidden={!values.feature}
      >
        Connect Discord
      </Button>
    </Form>
  );
};
