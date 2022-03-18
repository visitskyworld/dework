import { FormSection } from "@dewo/app/components/FormSection";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectRole, RulePermission } from "@dewo/app/graphql/types";
import { Card, Divider, Space, Spin, Typography } from "antd";
import React, { FC } from "react";
import { projectRoleDescription } from "../../project/settings/strings";
import { useOrganizationRoles } from "../hooks";
import { ProjectPrivateAlert } from "./ProjectPrivateAlert";
import { RBACPermissionForm } from "../RBACPermissionForm";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectRBAC: FC<Props> = ({ projectId, organizationId }) => {
  const canManagePermissions = usePermission("create", "Rule");
  const roles = useOrganizationRoles(organizationId);

  if (!roles) return <Spin />;
  return (
    <Space direction="vertical" size="large">
      <ProjectPrivateAlert
        projectId={projectId}
        organizationId={organizationId}
      />
      <Card size="small">
        <Typography.Title level={5}>Permissions</Typography.Title>
        <FormSection
          label="Project Steward"
          tooltip={
            <Typography.Text style={{ whiteSpace: "pre-line" }}>
              {projectRoleDescription[ProjectRole.ADMIN]}
            </Typography.Text>
          }
        >
          <RBACPermissionForm
            disabled={!canManagePermissions}
            permission={RulePermission.MANAGE_PROJECTS}
            roles={roles}
            projectId={projectId}
            organizationId={organizationId}
          />
        </FormSection>
        <Divider />
        <FormSection
          label="Contributor"
          tooltip={
            <Typography.Text style={{ whiteSpace: "pre-line" }}>
              {projectRoleDescription[ProjectRole.CONTRIBUTOR]}
            </Typography.Text>
          }
        >
          <RBACPermissionForm
            disabled={!canManagePermissions}
            permission={RulePermission.SUGGEST_AND_VOTE}
            roles={roles}
            projectId={projectId}
            organizationId={organizationId}
          />
        </FormSection>
      </Card>
    </Space>
  );
};
