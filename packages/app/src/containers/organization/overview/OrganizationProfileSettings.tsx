import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import {
  useOrganization,
  useUpdateOrganization,
  useUpdateOrganizationDetail,
} from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { EntityDetailType } from "@dewo/app/graphql/types";
import { OrganizationDetailFormItem } from "./OrganizationDetailFormItem";

interface SetOrganizationFormInput {
  name: string;
  tagline?: string;
  description?: string;
  discord?: string;
  twitter?: string;
  website?: string;
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
  const updateOrganizationDetail = useUpdateOrganizationDetail();

  const initialOrganizationFormValues = useMemo(
    () => ({
      name: organization?.name ?? "",
      tagline: organization?.tagline,
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
      if (
        JSON.stringify(initialOrganizationFormValues) === JSON.stringify(values)
      ) {
        // No changes
        return;
      }
      try {
        setLoading(true);
        await Promise.all(
          Object.entries(values).map(([key, value]) => {
            if (key === "discord" || key === "twitter" || key === "website") {
              updateOrganizationDetail({
                organizationId,
                type: key as EntityDetailType,
                value: value,
              });
            } else if (key === "name") {
              updateOrganization({
                id: organizationId,
                name: values.name,
                description: values.description,
                tagline: values.tagline,
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
      updateOrganizationDetail,
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
            label="Name"
            name="name"
            initialValue={organization.name}
            rules={[{ required: true, message: "Please enter a display name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tagline"
            name="tagline"
            initialValue={organization.tagline}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            initialValue={organization.description}
          >
            <Input.TextArea placeholder="No description..." />
          </Form.Item>

          <Form.Item label="Socials">
            <Space direction="vertical" style={{ width: "100%" }}>
              <OrganizationDetailFormItem type={EntityDetailType.discord} />
              <OrganizationDetailFormItem type={EntityDetailType.twitter} />
              <OrganizationDetailFormItem type={EntityDetailType.website} />
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
