import React from "react";
import {
  Image,
  Form,
  Typography,
  Collapse,
  Row,
  Space,
  Button,
  Select,
} from "antd";
import { DiscordIntegrationChannel } from "@dewo/app/graphql/types";
import { ConnectOrganizationToDiscordButton } from "./ConnectOrganizationToDiscordButton";
import {
  DiscordPermission,
  DiscordPermissionToString,
  DiscordProjectIntegrationFeature,
} from "../hooks";

interface Props {
  guildId: string;
  organizationId: string;
  channels?: DiscordIntegrationChannel[];
  missingPermissions: DiscordPermission[];
  feature?: DiscordProjectIntegrationFeature;
  initialValue?: string;
  hidden?: boolean;
  disabled?: boolean;
  onRefetchChannels(): Promise<void>;
}

export const SelectDiscordChannelFormItem = ({
  guildId,
  organizationId,
  feature,
  channels,
  missingPermissions,
  initialValue,
  hidden,
  disabled,
  onRefetchChannels,
}: Props) => (
  <Form.Item
    name="discordChannelId"
    initialValue={initialValue}
    label="Post In"
    hidden={hidden}
    rules={[
      {
        required: !!feature,
        message: "Please select a Discord channel",
      },
      (form) => ({
        async validator() {
          const selectedChannel = () =>
            channels?.find(
              (c) => c.id === form.getFieldValue("discordChannelId")
            );

          if (!selectedChannel) return;
          if (!!missingPermissions.length) {
            throw new Error();
          }
        },
        message: (
          <>
            <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
              Dework bot doesn't have the right permissions for this channel. To
              fix this, give the Dework bot the correct channel permissions or
              grant it admin access:
            </Typography.Paragraph>
            <Collapse accordion ghost defaultActiveKey={1}>
              <Collapse.Panel
                key={1}
                header="Grant Administrator Permissions (recommended)"
              >
                <Row>
                  <ConnectOrganizationToDiscordButton
                    asAdmin
                    guildId={guildId}
                    organizationId={organizationId}
                    children="Give Administrator Access"
                  />
                </Row>
              </Collapse.Panel>

              <Collapse.Panel key={2} header="Add Dework Bot to the Channel">
                <Space style={{ marginTop: 2 }}>
                  <Typography.Text type="secondary">
                    Follow these steps:
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
              </Collapse.Panel>
            </Collapse>
          </>
        ),
      }),
    ]}
  >
    <Select
      loading={!channels}
      disabled={disabled}
      placeholder="Select Discord Channel..."
      optionFilterProp="label"
      allowClear
      showSearch
    >
      {channels?.map((channel) => (
        <Select.Option key={channel.id} value={channel.id} label={channel.name}>
          {`#${channel.name}`}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
);
