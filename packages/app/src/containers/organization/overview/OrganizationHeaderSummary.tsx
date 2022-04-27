import React, { FC, useMemo } from "react";
import { Button, List, Skeleton, Typography } from "antd";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import Link from "next/link";
import { useOrganizationDetails } from "../hooks";

interface Props {
  organizationId: string | undefined;
}

export const OrganizationHeaderSummary: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganizationDetails(organizationId);
  const canUpdate = usePermission("update", organization);

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
        avatar={<Skeleton.Avatar active size={96} />}
        title={
          <Skeleton
            loading
            active
            paragraph={false}
            title={{ style: { width: 100 } }}
          />
        }
      />
    );
  }

  return (
    <>
      <List.Item.Meta
        avatar={<OrganizationAvatar organization={organization} size={96} />}
        title={
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            {organization.name}
          </Typography.Title>
        }
        description={description}
      />
    </>
  );
};
