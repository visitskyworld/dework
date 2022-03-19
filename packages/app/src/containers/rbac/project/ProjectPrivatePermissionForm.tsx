import { Row, Switch, Typography } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useCreateRule, useDeleteRule, useOrganizationRoles } from "../hooks";
import { RulePermission } from "@dewo/app/graphql/types";
import { RBACPermissionForm } from "../RBACPermissionForm";
import {
  useDefaultAbility,
  usePermission,
} from "@dewo/app/contexts/PermissionsContext";

interface Props {
  projectId: string;
  organizationId: string;
  onInviteUser?(): Promise<void>;
}

export const ProjectPrivatePermissionForm: FC<Props> = ({
  projectId,
  organizationId,
  onInviteUser,
}) => {
  const roles = useOrganizationRoles(organizationId);
  const canManagePermissions = usePermission("create", "Rule");

  const refetchDefaultAbility = useDefaultAbility(organizationId).refetch;

  const fallbackRole = useMemo(() => roles?.find((r) => r.fallback), [roles]);
  const privateRule = useMemo(
    () =>
      fallbackRole?.rules.find(
        (r) =>
          r.projectId === projectId &&
          r.inverted &&
          r.permission === RulePermission.VIEW_PROJECTS
      ),
    [fallbackRole, projectId]
  );

  const createRule = useCreateRule();
  const deleteRule = useDeleteRule();

  const [showPrivateOptions, setShowPrivateOptions] = useState(false);
  const toggled = showPrivateOptions || !!privateRule;

  const handleChangePrivate = useCallback(
    async (toggled: boolean) => {
      if (toggled) {
        setShowPrivateOptions(true);
      } else {
        setShowPrivateOptions(false);
        if (!!privateRule) {
          await deleteRule(privateRule.id);
          await refetchDefaultAbility();
        }
      }
    },
    [deleteRule, refetchDefaultAbility, privateRule]
  );

  const handleViewProjectsPermissionSaved = useCallback(
    async (hasFallbackRolePermission: boolean) => {
      if (hasFallbackRolePermission) {
        if (!!privateRule) {
          await deleteRule(privateRule.id);
        }
      } else {
        if (!privateRule) {
          await createRule({
            permission: RulePermission.VIEW_PROJECTS,
            projectId,
            inverted: true,
            roleId: fallbackRole!.id,
          });
        }
      }

      await refetchDefaultAbility();
    },
    [
      createRule,
      deleteRule,
      projectId,
      fallbackRole,
      privateRule,
      refetchDefaultAbility,
    ]
  );

  return (
    <>
      <Typography.Paragraph type="secondary">
        {toggled
          ? "Only the below roles and users can view this project and its tasks"
          : "Anyone can view this project and its tasks"}
      </Typography.Paragraph>
      <Row align="middle" style={{ gap: 8, marginBottom: 8 }}>
        <Typography.Text>Private Project</Typography.Text>
        <Switch
          checked={toggled}
          onChange={handleChangePrivate}
          disabled={!canManagePermissions}
        />
      </Row>
      {toggled && !!roles && (
        <RBACPermissionForm
          disabled={!canManagePermissions}
          permission={RulePermission.VIEW_PROJECTS}
          roles={roles}
          projectId={projectId}
          organizationId={organizationId}
          saveButtonTooltip="To make a project private, you need to select at least one role you have. Otherwise you will no longer be able to access the project."
          requiresCurrentUserToHaveRole
          onSaved={handleViewProjectsPermissionSaved}
          onInviteUser={onInviteUser}
        />
      )}
    </>
  );
};
