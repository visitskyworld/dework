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
        <FormSection label="Manage Project">
          <Typography.Paragraph
            type="secondary"
            className="ant-typography-caption"
          >
            Users with this permission can:
            <ul>
              <li>Manage project settings and integrations</li>
              <li>Create, update, delete tasks</li>
              <li>See, approve and deny task applications and submissions</li>
            </ul>
          </Typography.Paragraph>
          <RBACPermissionForm
            disabled={!canManagePermissions}
            permission={RulePermission.MANAGE_PROJECTS}
            roles={roles}
            projectId={projectId}
            organizationId={organizationId}
          />
        </FormSection>
        <Divider />
        <FormSection label="Suggest/Vote">
          <Typography.Paragraph
            type="secondary"
            className="ant-typography-caption"
          >
            Users with this permission can:
            <ul>
              <li>
                Create Community Suggestions (note: enable "Contributor
                Suggestions" in the General tab)
              </li>
              <li>Vote on tasks in Community Suggestions</li>
            </ul>
          </Typography.Paragraph>
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
