import { ProjectRole, RulePermission } from "@dewo/app/graphql/types";
import { Card, Divider, Spin, Tag, Tooltip, Typography } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { projectRoleDescription } from "../../project/settings/strings";
import { useOrganizationRoles } from "../hooks";
import { RBACPermissionForm } from "../RBACPermissionForm";
import { ProjectPrivatePermissionForm } from "./ProjectPrivatePermissionForm";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { useCreateInvite } from "../../invite/hooks";
import styles from "../CardRBAC.module.less";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectRBAC: FC<Props> = ({ projectId, organizationId }) => {
  const roles = useOrganizationRoles(organizationId);

  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createInvite = useCreateInvite();
  const inviteToProject = useCallback(
    async (permission: RulePermission) => {
      const inviteLink = await createInvite({ permission, projectId });
      copyToClipboardAndShowToast(inviteLink);
    },
    [createInvite, copyToClipboardAndShowToast, projectId]
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
      <Card bordered={false} className={styles.card}>
        <RBACPermissionForm
          permission={RulePermission.MANAGE_PROJECTS}
          roles={roles}
          projectId={projectId}
          organizationId={organizationId}
          onInviteUser={() => inviteToProject(RulePermission.MANAGE_PROJECTS)}
        />
      </Card>
      <Divider />
      <Typography.Title level={5}>
        Create Tasks
        <Tag
          color="green"
          style={{
            marginLeft: 4,
            fontWeight: "normal",
            textTransform: "none",
          }}
        >
          Recommended!
        </Tag>
        <Tooltip
          title={
            <Typography.Text style={{ whiteSpace: "pre-line" }}>
              This gives users the permission to create their own tasks and
              manage those (but not to attach a bounty to them). Highly
              recommended to give to all somewhat active contributors in your
              community
            </Typography.Text>
          }
        >
          <Icons.QuestionCircleOutlined style={{ marginLeft: 4 }} />
        </Tooltip>
      </Typography.Title>
      <Card bordered={false} className={styles.card}>
        <RBACPermissionForm
          permission={RulePermission.MANAGE_TASKS}
          roles={roles}
          projectId={projectId}
          organizationId={organizationId}
          onInviteUser={() => inviteToProject(RulePermission.MANAGE_TASKS)}
        />
      </Card>
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
      <Card bordered={false} className={styles.card}>
        <ProjectPrivatePermissionForm
          projectId={projectId}
          organizationId={organizationId}
          onInviteUser={() => inviteToProject(RulePermission.VIEW_PROJECTS)}
        />
      </Card>
    </>
  );
};
