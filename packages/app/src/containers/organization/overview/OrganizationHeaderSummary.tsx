import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { List, Skeleton, Typography } from "antd";
import React, { FC, useCallback } from "react";
import { useOrganization, useUpdateOrganization } from "../hooks";

interface Props {
  organizationId: string;
}

export const OrganizationHeaderSummary: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");

  const updateOrganization = useUpdateOrganization();
  const updateDescription = useCallback(
    (description: string) =>
      updateOrganization({ id: organizationId, description }),
    [updateOrganization, organizationId]
  );

  if (!organization) {
    return (
      <List.Item.Meta
        avatar={<Skeleton.Avatar active size={192} />}
        title={
          <Skeleton loading active paragraph={{ style: { maxWidth: 480 } }} />
        }
      />
    );
  }

  return (
    <List.Item.Meta
      avatar={<OrganizationAvatar organization={organization} size={192} />}
      title={
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          {organization.name}
        </Typography.Title>
      }
      description={
        (!!organization.description || canUpdateOrganization) && (
          <Typography.Paragraph
            type="secondary"
            style={{ maxWidth: 480 }}
            editable={
              canUpdateOrganization
                ? { onChange: updateDescription, autoSize: true }
                : undefined
            }
          >
            {organization.description || "No description..."}
          </Typography.Paragraph>
        )
      }
    />
  );
};
