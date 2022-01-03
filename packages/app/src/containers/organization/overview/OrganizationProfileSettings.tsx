import React, { FC, useCallback, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import * as Icons from "@ant-design/icons";
import { useOrganization, useUpdateOrganization } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { UpdateOrganizationInput } from "../../../graphql/types";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

interface Props {
  organizationId: string;
}

export const OrganizationProfileSettings: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");

  const updateOrganization = useUpdateOrganization();

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: UpdateOrganizationInput) => {
      try {
        setLoading(true);
        await updateOrganization({
          id: organizationId,
          name: values.name,
          description: values.description,
        });
        message.success({
          content: "Organization profile updated!",
          type: "success",
        });
      } catch {
        message.error({
          content: "Failed to update organization profile",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [organizationId, updateOrganization]
  );

  if (!organization) return null;

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", paddingLeft: 16, paddingRight: 16 }}
      contentEditable={canUpdateOrganization}
    >
      <Card>
        <Form<UpdateOrganizationInput>
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          style={{ maxWidth: 480 }}
        >
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            Organization profile
          </Typography.Title>
          <Divider style={{ marginTop: 0 }} />

          <Form.Item
            label="Organization display name"
            name="name"
            initialValue={organization.name}
            rules={[{ required: true, message: "Please enter a display name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            initialValue={organization.description}
            rules={[{ required: false }]}
          >
            <Input.TextArea placeholder="No description..." />
          </Form.Item>

          <Form.Item label="Details">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Row align="middle">
                <DiscordIcon style={{ width: 20 }} />
                <Form.Item
                  name="discord"
                  rules={[{ required: false }]}
                  style={{ flex: 1, margin: "0 0 0 8px" }}
                >
                  <Input placeholder="https://discord.com/channels/918603668935311391" />
                </Form.Item>
              </Row>
              <Row align="middle">
                <Icons.TwitterOutlined style={{ width: 20 }} />
                <Form.Item
                  name="twitter"
                  rules={[{ required: false }]}
                  style={{ flex: 1, margin: "0 0 0 8px" }}
                >
                  <Input placeholder="https://twitter.com/deworkxyz" />
                </Form.Item>
              </Row>
              <Row align="middle">
                <Icons.EnvironmentOutlined style={{ width: 20 }} />
                <Form.Item
                  name="location"
                  rules={[{ required: false }]}
                  style={{ flex: 1, margin: "0 0 0 8px" }}
                >
                  <Input placeholder="Lisbon" />
                </Form.Item>
              </Row>
            </Space>
          </Form.Item>

          <Button
            type="ghost"
            htmlType="submit"
            size="middle"
            loading={loading}
            disabled={!canUpdateOrganization}
          >
            Update profile
          </Button>
        </Form>
      </Card>
    </Space>
  );
};
