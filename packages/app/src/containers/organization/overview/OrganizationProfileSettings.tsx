import React, { FC, useCallback, useMemo, useState } from "react";
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
import {
  useOrganization,
  useUpdateOrganization,
  useUpdateOrganizationDetail,
} from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { EntityDetailType } from "@dewo/app/graphql/types";

interface SetOrganizationFormInput {
  name: string;
  description?: string;
  discord?: EntityDetailType.discord;
  twitter?: EntityDetailType.twitter;
  website?: EntityDetailType.website;
}

interface OrganizationProfileSettingsProps {
  organizationId: string;
}

export const OrganizationProfileSettings: FC<
  OrganizationProfileSettingsProps
> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");

  const updateOrganization = useUpdateOrganization();
  const updateOrganisazionDetail = useUpdateOrganizationDetail();

  const initialOrganizationFormValues = useMemo(
    () => ({
      name: organization?.name ?? "",
      description: organization?.description,
      discord: organization?.details.find((d) => d.type === "discord")?.value,
      twitter: organization?.details.find((d) => d.type === "twitter")?.value,
      website: organization?.details.find((d) => d.type === "website")?.value,
    }),
    [organization]
  );

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: SetOrganizationFormInput) => {
      try {
        setLoading(true);
        await Promise.all(
          Object.keys(initialOrganizationFormValues).map((key) => {
            if (key === "name" || key === "description") {
              updateOrganization({
                id: organizationId,
                name: values.name,
                description: values.description,
              });
            } else if (
              key === "discord" ||
              key === "twitter" ||
              key === "website"
            ) {
              updateOrganisazionDetail({
                organizationId,
                type: key as EntityDetailType,
                value: values[key],
              });
            }
          })
        );

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
    [
      organizationId,
      initialOrganizationFormValues,
      updateOrganization,
      updateOrganisazionDetail,
    ]
  );

  if (!organization) return null;

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", paddingLeft: 16, paddingRight: 16 }}
    >
      <Card>
        <Form<SetOrganizationFormInput>
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          style={{ maxWidth: 480 }}
          initialValues={initialOrganizationFormValues}
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

          <Form.Item label="Socials">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Row align="middle">
                <DiscordIcon style={{ width: 20 }} />
                <Form.Item
                  name="discord"
                  style={{ flex: 1, margin: "0 0 0 8px" }}
                >
                  <Input placeholder="https://discord.com/channels/918603668935311391" />
                </Form.Item>
              </Row>
              <Row align="middle">
                <Icons.TwitterOutlined style={{ width: 20 }} />
                <Form.Item
                  name="twitter"
                  style={{ flex: 1, margin: "0 0 0 8px" }}
                >
                  <Input placeholder="https://twitter.com/deworkxyz" />
                </Form.Item>
              </Row>
              <Row align="middle">
                <Icons.LinkOutlined style={{ width: 20 }} />
                <Form.Item
                  name="website"
                  style={{ flex: 1, margin: "0 0 0 8px" }}
                >
                  <Input placeholder="https://dework.xyz" />
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
