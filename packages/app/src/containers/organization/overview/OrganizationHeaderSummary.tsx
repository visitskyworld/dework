import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { List, Skeleton, Typography } from "antd";
import React, { FC } from "react";
import { useOrganization } from "../hooks";

interface Props {
  organizationId: string;
}

export const OrganizationHeaderSummary: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);

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
        <>
          <Typography.Paragraph
            type="secondary"
            style={{ marginBottom: 8, maxWidth: 480 }}
            ellipsis={{ rows: 2 }}
          >
            {organization.description}
          </Typography.Paragraph>
        </>
      }
    />
  );
};
