import { Alert, Row, Switch, Typography } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useCreateRule, useDeleteRule, useOrganizationRoles } from "../hooks";
import { RulePermission } from "@dewo/app/graphql/types";
import { RBACPermissionForm } from "./RBACPermissionForm";
import {
  useDefaultAbility,
  usePermission,
} from "@dewo/app/contexts/PermissionsContext";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectPrivateAlert: FC<Props> = ({
  projectId,
  organizationId,
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
      <Alert
        type="info"
        message={
          <>
            <Row align="middle" style={{ gap: 8 }}>
              <Icons.LockFilled />
              <Typography.Text strong style={{ flex: 1 }}>
                Private Project
              </Typography.Text>
              <Switch
                checked={toggled}
                onChange={handleChangePrivate}
                disabled={!canManagePermissions}
              />
            </Row>
            <Typography.Paragraph
              type="secondary"
              className="ant-typography-caption"
            >
              By making a project private, only select roles will be able to
              view the project and its tasks.
            </Typography.Paragraph>
          </>
        }
        description={
          toggled && !!roles ? (
            <>
              <RBACPermissionForm
                disabled={!canManagePermissions}
                permission={RulePermission.VIEW_PROJECTS}
                roles={roles}
                projectId={projectId}
                organizationId={organizationId}
                defaultOpen={showPrivateOptions}
                saveButtonTooltip="You need to select at least one role you have"
                // requiresCurrentUserToHaveRole
                onSaved={handleViewProjectsPermissionSaved}
              />
            </>
          ) : (
            <div />
          )
        }
      />
    </>
  );
};
