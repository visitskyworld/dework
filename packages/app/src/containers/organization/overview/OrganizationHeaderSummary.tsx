import React, { FC, useMemo } from "react";
import { Button, List, Row, Skeleton, Typography } from "antd";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import Link from "next/link";
import { useOrganizationDetails } from "../hooks";
import { useOrganizationRoles } from "../../rbac/hooks";
import { RulePermission } from "@dewo/app/graphql/types";

interface Props {
  organizationId: string | undefined;
}

export const OrganizationHeaderSummary: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganizationDetails(organizationId);
  const canUpdate = usePermission("update", organization);
  const canManagePermissions = usePermission("create", {
    __typename: "Rule",
    permission: RulePermission.MANAGE_ORGANIZATION,
  });
  const roles = useOrganizationRoles(organizationId);

  const showSetupProfile = !!organization && !organization.tagline && canUpdate;
  const showSetupPermissions = useMemo(() => {
    if (!roles || !canManagePermissions) return false;
    const rolesWithPermissions = roles.filter(
      (r) => !r.fallback && !!r.rules.length
    );
    const hasSetupPermissionsForMoreThanOrgCreator =
      rolesWithPermissions.length > 1;
    return !hasSetupPermissionsForMoreThanOrgCreator;
  }, [roles, canManagePermissions]);

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
        description={
          <>
            {!!organization?.tagline && (
              <Typography.Paragraph type="secondary" style={{ maxWidth: 480 }}>
                {organization.tagline}
              </Typography.Paragraph>
            )}

            {(showSetupProfile || showSetupPermissions) && (
              <Row style={{ columnGap: 8 }}>
                {showSetupProfile && (
                  <Link href={`${organization.permalink}/settings/profile`}>
                    <a>
                      <Button
                        size="small"
                        type="primary"
                        name="Setup DAO Profile from overview header"
                      >
                        Setup profile
                      </Button>
                    </a>
                  </Link>
                )}
                {showSetupPermissions && (
                  <Link href={`${organization.permalink}/settings/access`}>
                    <a>
                      <Button
                        size="small"
                        name="Setup DAO permissions from overview header"
                      >
                        Setup permissions
                      </Button>
                    </a>
                  </Link>
                )}
              </Row>
            )}
          </>
        }
      />
    </>
  );
};
