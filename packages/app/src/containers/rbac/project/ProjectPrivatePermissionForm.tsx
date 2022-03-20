import { Row, Switch, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import {
  useCreateRole,
  useCreateRule,
  useDeleteRule,
  useOrganizationRoles,
} from "../hooks";
import { RulePermission } from "@dewo/app/graphql/types";
import { RBACPermissionForm } from "../RBACPermissionForm";
import {
  useDefaultAbility,
  usePermission,
} from "@dewo/app/contexts/PermissionsContext";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

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
  const { user } = useAuthContext();
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

  const createRole = useCreateRole();
  const createRule = useCreateRule();
  const deleteRule = useDeleteRule();

  const handleChangePrivate = useCallback(
    async (toggled: boolean) => {
      if (toggled) {
        const personalRole =
          roles?.find((r) => r.userId === user!.id) ??
          (await createRole({
            name: "",
            color: "",
            organizationId,
            userId: user!.id,
          }));
        await createRule({
          permission: RulePermission.VIEW_PROJECTS,
          projectId,
          roleId: personalRole.id,
        });

        await createRule({
          permission: RulePermission.VIEW_PROJECTS,
          projectId,
          inverted: true,
          roleId: fallbackRole!.id,
        });
      } else {
        if (!!privateRule) {
          await deleteRule(privateRule.id);
        }
      }

      await refetchDefaultAbility();
    },
    [
      deleteRule,
      refetchDefaultAbility,
      privateRule,
      roles,
      projectId,
      createRule,
      createRole,
      organizationId,
      fallbackRole,
      user,
    ]
  );

  return (
    <>
      <Typography.Paragraph type="secondary">
        {!!privateRule
          ? "Only the below roles and users can view this project and its tasks"
          : "Anyone can view this project and its tasks"}
      </Typography.Paragraph>
      <Row align="middle" style={{ gap: 8, marginBottom: 8 }}>
        <Typography.Text>Private Project</Typography.Text>
        <Switch
          checked={!!privateRule}
          onChange={handleChangePrivate}
          disabled={!canManagePermissions}
        />
      </Row>
      {!!privateRule && !!roles && (
        <RBACPermissionForm
          disabled={!canManagePermissions}
          permission={RulePermission.VIEW_PROJECTS}
          roles={roles}
          projectId={projectId}
          organizationId={organizationId}
          saveButtonTooltip="To make a project private, you need to select at least one role you have. Otherwise you will no longer be able to access the project."
          requiresCurrentUserToHaveRole
          onInviteUser={onInviteUser}
        />
      )}
    </>
  );
};
