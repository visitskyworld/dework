import React, { FC, useMemo } from "react";
import { Button, List, Skeleton, Typography } from "antd";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { useOrganization } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import Link from "next/link";

interface Props {
  organizationId: string;
}

export const OrganizationHeaderSummary: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  const canUpdate = usePermission("update", "Project");

  const description = useMemo(() => {
    if (!organization) return null;
    if (!!organization?.tagline) {
      return (
        <Typography.Paragraph type="secondary" style={{ maxWidth: 480 }}>
          {organization.tagline}
        </Typography.Paragraph>
      );
    }

    if (canUpdate) {
      return (
        <Link href={`${organization.permalink}/settings/profile`}>
          <a>
            <Button size="small" type="primary">
              Set up profile
            </Button>
          </a>
        </Link>
      );
    }

    return null;
  }, [organization, canUpdate]);

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
      description={description}
    />
  );
};
