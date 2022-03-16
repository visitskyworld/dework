import { FormSection } from "@dewo/app/components/FormSection";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { RulePermission } from "@dewo/app/graphql/types";
import { Card, Divider, Space, Typography } from "antd";
import React, { FC } from "react";
import { ProjectPrivateAlert } from "./ProjectPrivateAlert";
import { RBACPermissionForm } from "./RBACPermissionForm";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectRBAC: FC<Props> = ({ projectId, organizationId }) => {
  const canManagePermissions = usePermission("create", "Rule");
  return (
    <Space direction="vertical" size="large">
      <ProjectPrivateAlert
        projectId={projectId}
        organizationId={organizationId}
      />
      <Card size="small">
        <Typography.Title level={5}>Other Permissions</Typography.Title>
        <FormSection label="Manage Project">
          <Typography.Paragraph
            type="secondary"
            className="ant-typography-caption"
          >
            Users with this permission can:
            <ul>
              <li>Update the project name and description</li>
              <li>Add and remove integrations</li>
            </ul>
          </Typography.Paragraph>
          <RBACPermissionForm
            disabled={!canManagePermissions}
            permission={RulePermission.MANAGE_PROJECTS}
            projectId={projectId}
            organizationId={organizationId}
          />
        </FormSection>
        <Divider />
        <FormSection label="Manage Tasks">
          <Typography.Paragraph
            type="secondary"
            className="ant-typography-caption"
          >
            Users with this permission can:
            <ul>
              <li>Create, update, delete tasks</li>
              <li>See, approve and deny task applications</li>
              <li>See, approve and deny task submissions</li>
            </ul>
          </Typography.Paragraph>
          <RBACPermissionForm
            disabled={!canManagePermissions}
            permission={RulePermission.MANAGE_TASKS}
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
            permission={RulePermission.MANAGE_TASKS}
            projectId={projectId}
            organizationId={organizationId}
          />
        </FormSection>
      </Card>
    </Space>
  );
};
