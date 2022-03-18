import { FormSection } from "@dewo/app/components/FormSection";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { RulePermission } from "@dewo/app/graphql/types";
import { Card, Divider, Spin, Typography } from "antd";
import React, { FC } from "react";
import { useOrganizationRoles } from "../hooks";
import { RBACPermissionForm } from "../RBACPermissionForm";

interface Props {
  organizationId: string;
}

export const OrganizationRBAC: FC<Props> = ({ organizationId }) => {
  const canManagePermissions = usePermission("create", "Rule");
  const roles = useOrganizationRoles(organizationId);

  if (!roles) return <Spin />;
  return (
    <Card size="small">
      <Typography.Title level={5}>Permissions</Typography.Title>
      <FormSection
        label="Manage Organization"
        tooltip={
          <Typography.Text style={{ whiteSpace: "pre-line" }}>
            Manage organization settings and user permissions
          </Typography.Text>
        }
      >
        <RBACPermissionForm
          disabled={!canManagePermissions}
          permission={RulePermission.MANAGE_ORGANIZATION}
          roles={roles}
          organizationId={organizationId}
        />
      </FormSection>
      <Divider />
      <FormSection
        label="Manage Projects"
        tooltip={
          <Typography.Text style={{ whiteSpace: "pre-line" }}>
            Create and manage tasks in projects
          </Typography.Text>
        }
      >
        <RBACPermissionForm
          disabled={!canManagePermissions}
          permission={RulePermission.MANAGE_PROJECTS}
          roles={roles}
          organizationId={organizationId}
        />
      </FormSection>
    </Card>
  );
};
