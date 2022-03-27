import { ProjectRole, RulePermission } from "@dewo/app/graphql/types";
import { Divider, Spin, Tooltip, Typography } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { projectRoleDescription } from "../../project/settings/strings";
import { useOrganizationRoles } from "../hooks";
import { RBACPermissionForm } from "../RBACPermissionForm";
import { ProjectPrivatePermissionForm } from "./ProjectPrivatePermissionForm";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { useCreateProjectInvite } from "../../invite/hooks";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectRBAC: FC<Props> = ({ projectId, organizationId }) => {
  const roles = useOrganizationRoles(organizationId);

  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createProjectInvite = useCreateProjectInvite();
  const inviteToProject = useCallback(
    async (role: ProjectRole) => {
      const inviteLink = await createProjectInvite({ role, projectId });
      copyToClipboardAndShowToast(inviteLink);
    },
    [createProjectInvite, copyToClipboardAndShowToast, projectId]
  );

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
        permission={RulePermission.MANAGE_PROJECTS}
        roles={roles}
        projectId={projectId}
        organizationId={organizationId}
        onInviteUser={() => inviteToProject(ProjectRole.ADMIN)}
      />
      <Divider />

      <Typography.Title level={5}>
        Create Tasks
        <Tooltip
          title={
            <Typography.Text style={{ whiteSpace: "pre-line" }}>
              This gives users the permission to create their own tasks and
              manage those (but not to attach a bounty to them)
            </Typography.Text>
          }
        >
          <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      </Typography.Title>
      <RBACPermissionForm
        permission={RulePermission.MANAGE_TASKS}
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
        onInviteUser={() => inviteToProject(ProjectRole.CONTRIBUTOR)}
      />
    </>
  );
};
