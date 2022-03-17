import { FormSection } from "@dewo/app/components/FormSection";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { RulePermission } from "@dewo/app/graphql/types";
import { Card, Divider, Space, Spin, Typography } from "antd";
import React, { FC } from "react";
import { useOrganizationRoles } from "../hooks";
import { ProjectPrivateAlert } from "./ProjectPrivateAlert";
import { RBACPermissionForm } from "./RBACPermissionForm";

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
          tooltip={[
            "Users with this permission can:",
            "- Manage project settings and integrations",
            "- Create, update, delete tasks",
            "- See, approve and deny task applications and submissions",
          ].join("\n")}
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
          tooltip={[
            "Users with this permission can:",
            '- Create Community Suggestions (note: enable "Contributor Suggestions" in the General tab)',
            "- Vote on tasks in Community Suggestions",
          ].join("\n")}
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
