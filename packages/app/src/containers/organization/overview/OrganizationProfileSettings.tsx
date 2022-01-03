import React, { FC, useCallback, useState } from "react";
import { Button, Card, Form, Input, message, Space } from "antd";
import { useOrganization, useUpdateOrganization } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { UpdateOrganizationInput } from "../../../graphql/types";

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
          <Form.Item
            label="Organization display name"
            name="name"
            initialValue={organization.name}
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            initialValue={organization.description}
            rules={[{ required: false, message: "No description..." }]}
          >
            <Input.TextArea />
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
