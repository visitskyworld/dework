import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectRole, RulePermission } from "@dewo/app/graphql/types";
import { Divider, Spin, Tooltip, Typography } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { projectRoleDescription } from "../../project/settings/strings";
import { useOrganizationRoles } from "../hooks";
import { RBACPermissionForm } from "../RBACPermissionForm";
import { ProjectPrivatePermissionForm } from "./ProjectPrivatePermissionForm";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectRBAC: FC<Props> = ({ projectId, organizationId }) => {
  const canManagePermissions = usePermission("create", "Rule");
  const roles = useOrganizationRoles(organizationId);

  if (!roles) return <Spin />;
  return (
    <>
      <Typography.Title level={5}>
        Manage Project
        <Tooltip
          title={
            <Typography.Text style={{ whiteSpace: "pre-line" }}>
              {projectRoleDescription[ProjectRole.ADMIN]}
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
        projectId={projectId}
        organizationId={organizationId}
      />
      <Divider />

      <Typography.Title level={5}>
        View Project
        <Tooltip
          title={
            <Typography.Text style={{ whiteSpace: "pre-line" }}>
              {projectRoleDescription[ProjectRole.CONTRIBUTOR]}
            </Typography.Text>
          }
        >
          <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      </Typography.Title>
      <ProjectPrivatePermissionForm
        projectId={projectId}
        organizationId={organizationId}
      />
    </>
  );
};
