import React, { FC, useCallback, useState } from "react";
import { Button, Col, Form, Row, Select, Typography } from "antd";
import { useOrganizationDiscordChannels } from "../organization/hooks";
import { useForm } from "antd/lib/form/Form";
import { DiscordProjectIntegrationFeature } from "./hooks";
import { useToggle } from "@dewo/app/util/hooks";
import { DiscordIntegrationChannel } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";

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

export interface FormValues {
  discordChannelId: string;
  discordThreadId?: string;
  discordFeature: DiscordProjectIntegrationFeature;
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
  discordFeature:
    DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
};

interface FormFieldProps {
  values: Partial<FormValues>;
  channels?: DiscordIntegrationChannel[];
  threads?: DiscordIntegrationChannel[];
}

export const DiscordIntegrationFormFields: FC<FormFieldProps> = ({
  values,
  channels,
  threads,
}) => {
  const showThreadSelect =
    values.discordFeature ===
    DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD;

  return (
    <>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
        Want to automatically create Discord threads to discuss Dework tasks?
        Try out the Discord integration for this project!
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
            name="discordChannelId"
            label="Post In"
            hidden={!values.discordFeature}
            rules={[
              {
                required: !!values.discordFeature,
                message: "Please select a Discord channel",
              },
            ]}
          >
            <Select
              loading={!channels}
              placeholder="Select Discord Channel..."
              allowClear
            >
              {channels?.map((channel) => (
                <Select.Option key={channel.id} value={channel.id}>
                  {`#${channel.name}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
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
            >
              {threads?.map((channel) => (
                <Select.Option key={channel.id} value={channel.id}>
                  {channel.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
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
    },
    [form]
  );

  const discordChannels = useOrganizationDiscordChannels({ organizationId });
  const discordThreads = useOrganizationDiscordChannels(
    { organizationId, discordParentChannelId: values.discordChannelId },
    !values.discordChannelId
  );

  const submitting = useToggle();
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const channel = discordChannels?.find(
        (c) => c.id === values.discordChannelId
      );
      const thread = discordThreads?.find(
        (t) => t.id === values.discordThreadId
      );
      if (!channel) return;

      try {
        submitting.toggleOn();
        await onSubmit({ channel, thread, feature: values.discordFeature });
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
      <FormSection label="Discord Integration">
        <DiscordIntegrationFormFields
          values={values}
          channels={discordChannels}
          threads={discordThreads}
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
      </FormSection>
    </Form>
  );
};
