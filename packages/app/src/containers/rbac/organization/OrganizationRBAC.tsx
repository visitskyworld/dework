import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { RulePermission } from "@dewo/app/graphql/types";
import { Divider, Spin, Tooltip, Typography } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
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
    <>
      <Typography.Title level={5}>
        Manage Organization
        <Tooltip
          title={
            <Typography.Text style={{ whiteSpace: "pre-line" }}>
              Manage organization settings and user permissions
            </Typography.Text>
          }
        >
          <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      </Typography.Title>
      <RBACPermissionForm
        disabled={!canManagePermissions}
        permission={RulePermission.MANAGE_ORGANIZATION}
        roles={roles}
        organizationId={organizationId}
      />
      <Divider />

      <Typography.Title level={5}>
        Manage Projects
        <Tooltip
          title={
            <Typography.Text style={{ whiteSpace: "pre-line" }}>
              Create and manage tasks in projects
            </Typography.Text>
          }
        >
          <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      </Typography.Title>
      <RBACPermissionForm
        disabled={!canManagePermissions}
        permission={RulePermission.MANAGE_PROJECTS}
        roles={roles}
        organizationId={organizationId}
      />
    </>
  );
};
