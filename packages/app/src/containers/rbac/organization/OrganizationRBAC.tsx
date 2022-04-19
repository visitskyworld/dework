import { RulePermission } from "@dewo/app/graphql/types";
import { Card, Divider, Spin, Tooltip, Typography } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { useOrganizationRoles } from "../hooks";
import { RBACPermissionForm } from "../RBACPermissionForm";
import styles from "../CardRBAC.module.less";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { useCreateInvite } from "../../invite/hooks";

interface Props {
  organizationId: string;
}

export const OrganizationRBAC: FC<Props> = ({ organizationId }) => {
  const roles = useOrganizationRoles(organizationId);

  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createInvite = useCreateInvite();
  const inviteToOrganization = useCallback(
    async (permission: RulePermission) => {
      const inviteLink = await createInvite({
        organizationId,
        permission,
      });
      copyToClipboardAndShowToast(inviteLink);
    },
    [createInvite, organizationId, copyToClipboardAndShowToast]
  );
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
      <Card bordered={false} className={styles.card}>
        <RBACPermissionForm
          permission={RulePermission.MANAGE_ORGANIZATION}
          roles={roles}
          organizationId={organizationId}
          saveButtonTooltip="Organization Managers can add and remove permissions. You need to select at least one role you have, otherwise you will lock yourself out of managing permissions for this organization."
          requiresCurrentUserToHaveRole
          onInviteUser={() =>
            inviteToOrganization(RulePermission.MANAGE_ORGANIZATION)
          }
        />
      </Card>
      <Divider />

      <Typography.Title level={5}>
        Manage All Projects
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
      <Card bordered={false} className={styles.card}>
        <RBACPermissionForm
          permission={RulePermission.MANAGE_PROJECTS}
          roles={roles}
          organizationId={organizationId}
          onInviteUser={() =>
            inviteToOrganization(RulePermission.MANAGE_PROJECTS)
          }
        />
      </Card>
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
      <Card bordered={false} className={styles.card}>
        <RBACPermissionForm
          permission={RulePermission.MANAGE_TASKS}
          roles={roles}
          organizationId={organizationId}
          onInviteUser={() => inviteToOrganization(RulePermission.MANAGE_TASKS)}
        />
      </Card>
    </>
  );
};
