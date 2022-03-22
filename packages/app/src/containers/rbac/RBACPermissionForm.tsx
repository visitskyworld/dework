import { UserSelect } from "@dewo/app/components/form/UserSelect";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Icons from "@ant-design/icons";
import {
  RoleSource,
  RoleWithRules,
  Rule,
  RulePermission,
} from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, Form, message, Row, Select, Tooltip, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import _ from "lodash";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useOrganizationUsers } from "../organization/hooks";
import { useMyRoles } from "../user/hooks";
import { useCreateRole, useCreateRule, useDeleteRule } from "./hooks";
import { ConnectOrganizationToDiscordButton } from "../integrations/ConnectOrganizationToDiscordButton";
import { useOrganizationDiscordIntegration } from "../integrations/hooks";

interface FormValues {
  roleIds: string[];
  userIds: string[];
}

interface Props {
  projectId?: string;
  organizationId: string;
  roles: RoleWithRules[];
  permission: RulePermission;
  disabled?: boolean;
  saveButtonTooltip?: string;
  requiresCurrentUserToHaveRole?: boolean;
  onInviteUser?(): Promise<void>;
}

export function getRule(
  role: RoleWithRules,
  permission: RulePermission,
  projectId?: string
): Rule | undefined {
  return role.rules.find(
    (r) =>
      (r.projectId ?? undefined) === projectId &&
      r.permission === permission &&
      !r.inverted
  );
}

function hasRule(
  role: RoleWithRules,
  permission: RulePermission,
  projectId?: string
): boolean {
  return !!getRule(role, permission, projectId);
}

function useSubmitEnabled(
  values: FormValues,
  requiresCurrentUserToHaveRole: boolean
): boolean {
  const { user } = useAuthContext();
  const myRoles = useMyRoles();
  const hasCurrentUserRole = useMemo(
    () =>
      values.userIds.includes(user?.id!) ||
      !!myRoles?.some((role) => values.roleIds.includes(role.id)),
    [values, user, myRoles]
  );

  return !requiresCurrentUserToHaveRole || hasCurrentUserRole;
}

export const RBACPermissionForm: FC<Props> = ({
  projectId,
  organizationId,
  roles,
  permission,
  disabled,
  saveButtonTooltip,
  requiresCurrentUserToHaveRole = false,
  onInviteUser,
}) => {
  const discordConnected = !!useOrganizationDiscordIntegration(organizationId);

  const { users } = useOrganizationUsers(organizationId);
  const organizationRoles = useMemo(
    () => roles?.filter((role) => !role.userId && !role.fallback),
    [roles]
  );
  const userRoles = useMemo(
    () => roles?.filter((role) => !!role.userId),
    [roles]
  );

  const [form] = useForm<FormValues>();
  const initialValues = useMemo(
    () => ({
      roleIds: roles
        .filter((r) => hasRule(r, permission, projectId) && !r.userId)
        .map((r) => r.id),
      userIds: roles
        .filter((r) => hasRule(r, permission, projectId) && !!r.userId)
        .map((r) => r.userId!)
        .filter((userId, index, array) => array.indexOf(userId) === index),
    }),
    [roles, permission, projectId]
  );
  const [values, setValues] = useState<FormValues>(initialValues);
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: FormValues) => setValues(values),
    []
  );

  const createRule = useCreateRule();
  const createRole = useCreateRole();
  const deleteRule = useDeleteRule();
  const [handleSave, saving] = useRunningCallback(
    async (values: FormValues) => {
      const removedOrganizationRoles = organizationRoles?.filter(
        (role) =>
          hasRule(role, permission, projectId) &&
          !values.roleIds.includes(role.id)
      );
      const addedOrganizationRoles = organizationRoles?.filter(
        (role) =>
          !hasRule(role, permission, projectId) &&
          values.roleIds.includes(role.id)
      );

      const removedUserRoles = userRoles?.filter(
        (role) =>
          hasRule(role, permission, projectId) &&
          !values.userIds.includes(role.userId!)
      );

      const selectedUserRoles = await Promise.all(
        values.userIds.map(async (userId) => {
          const userRole = userRoles?.find((r) => r.userId === userId);
          if (userRole) return userRole;
          return createRole({
            name: "",
            color: "",
            organizationId,
            userId,
          });
        })
      );

      const addedUserRoles = selectedUserRoles.filter(
        (role) =>
          !hasRule(role, permission, projectId) &&
          values.userIds.includes(role.userId!)
      );

      const removedRoles = [...removedOrganizationRoles, ...removedUserRoles];
      const addedRoles = [...addedOrganizationRoles, ...addedUserRoles];

      for (const role of addedRoles) {
        await createRule({ permission, projectId, roleId: role.id });
      }

      for (const role of removedRoles) {
        const rule = getRule(role, permission, projectId);
        await deleteRule(rule!.id);
      }

      message.success("Permissions updated!");
    },
    [createRule, deleteRule, organizationRoles, userRoles]
  );

  const [handleInviteUser, invitingUser] = useRunningCallback(
    () => onInviteUser?.(),
    [onInviteUser]
  );

  const dirty = useMemo(
    () =>
      !_.isEqual(_.sortBy(values.userIds), _.sortBy(initialValues.userIds)) ||
      !_.isEqual(_.sortBy(values.roleIds), _.sortBy(initialValues.roleIds)),
    [initialValues, values]
  );
  const buttonDisabled = !useSubmitEnabled(
    values,
    requiresCurrentUserToHaveRole
  );
  const button = (
    <Button
      type="primary"
      htmlType="submit"
      disabled={buttonDisabled}
      loading={saving}
    >
      Save
    </Button>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      style={{ overflow: "hidden" }}
      onValuesChange={handleChange}
      onFinish={handleSave}
    >
      {(!disabled || !!values.roleIds.length) &&
        (!discordConnected ? (
          <Form.Item label="Roles" name="roleIds">
            <Typography.Paragraph type="secondary" style={{ marginBottom: 4 }}>
              Connect Discord to manage access using roles from your server
            </Typography.Paragraph>
            <ConnectOrganizationToDiscordButton
              type="ghost"
              icon={<DiscordIcon />}
              organizationId={organizationId}
            />
          </Form.Item>
        ) : (
          <Form.Item label="Roles" name="roleIds">
            <Select
              mode="multiple"
              placeholder="Select Roles..."
              showSearch
              disabled={disabled}
              optionFilterProp="label"
              loading={!organizationRoles}
            >
              {organizationRoles?.map((role) => (
                <Select.Option key={role.id} value={role.id} label={role.name}>
                  <Row align="middle">
                    {role.source === RoleSource.DISCORD && (
                      <DiscordIcon style={{ marginRight: 4, opacity: 0.5 }} />
                    )}
                    {role.name}
                  </Row>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ))}
      {(!disabled || !!values.userIds.length) && (
        <Row align="bottom" style={{ gap: 8 }}>
          <Form.Item label="Users" name="userIds" style={{ flex: 1 }}>
            <UserSelect
              mode="multiple"
              placeholder="Select Users..."
              disabled={disabled}
              users={users}
            />
          </Form.Item>
          {!disabled && (
            <Button
              type="ghost"
              loading={invitingUser}
              icon={<Icons.UsergroupAddOutlined />}
              style={{ marginBottom: 12 }}
              onClick={handleInviteUser}
            >
              Invite
            </Button>
          )}
        </Row>
      )}

      {!disabled &&
        dirty &&
        (!!saveButtonTooltip ? (
          <Tooltip title={saveButtonTooltip} placement="bottom">
            {button}
          </Tooltip>
        ) : (
          button
        ))}
    </Form>
  );
};
