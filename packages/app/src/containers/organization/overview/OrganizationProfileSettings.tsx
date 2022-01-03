import React, { FC, useCallback } from "react";
import { Card, Space, Typography } from "antd";
import { useOrganization, useUpdateOrganization } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

interface Props {
  organizationId: string;
}

export const OrganizationProfileSettings: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");

  const updateOrganization = useUpdateOrganization();
  const updateName = useCallback(
    (name: string) => updateOrganization({ id: organizationId, name }),
    [updateOrganization, organizationId]
  );
  const updateDescription = useCallback(
    (description: string) =>
      updateOrganization({ id: organizationId, description }),
    [updateOrganization, organizationId]
  );

  if (!organization) return null;

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", paddingLeft: 16, paddingRight: 16 }}
    >
      <Card>
        <Typography.Title
          level={2}
          editable={
            canUpdateOrganization
              ? { onChange: updateName, autoSize: true }
              : undefined
          }
        >
          {organization.name}
        </Typography.Title>
        <Typography.Paragraph
          type="secondary"
          editable={
            canUpdateOrganization
              ? { onChange: updateDescription, autoSize: true }
              : undefined
          }
        >
          {organization.description || "No description..."}
        </Typography.Paragraph>
      </Card>
    </Space>
  );
};
