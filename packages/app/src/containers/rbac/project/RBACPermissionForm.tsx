import { RoleWithRules, Rule, RulePermission } from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, message, Select, Space, Tooltip } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useCreateRule, useDeleteRule, useOrganizationRoles } from "../hooks";

interface Props {
  projectId: string;
  organizationId: string;
  permission: RulePermission;
  defaultOpen?: boolean;
  disabled?: boolean;
  saveButtonTooltip?: string;
  isSubmitDisabled?(selectedRoleIds: string[]): boolean;
  onSaved?(hasFallbackRolePermission: boolean): void;
}

function getRule(
  role: RoleWithRules,
  permission: RulePermission,
  projectId: string
): Rule | undefined {
  return role.rules.find(
    (r) =>
      r.projectId === projectId && r.permission === permission && !r.inverted
  );
}

export const RBACPermissionForm: FC<Props> = ({
  projectId,
  organizationId,
  permission,
  defaultOpen,
  disabled,
  saveButtonTooltip,
  isSubmitDisabled,
  onSaved,
}) => {
  const roles = useOrganizationRoles(organizationId);
  const currentRoles = useMemo(
    () => roles?.filter((role) => !!getRule(role, permission, projectId)),
    [roles, projectId, permission]
  );

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>();
  useEffect(() => {
    setSelectedRoleIds(currentRoles?.map((r) => r.id));
  }, [currentRoles]);

  const createRule = useCreateRule();
  const deleteRule = useDeleteRule();
  const [handleSave, saving] = useRunningCallback(async () => {
    if (!selectedRoleIds) return;

    const removedRoles = roles?.filter(
      (role) =>
        !!getRule(role, permission, projectId) &&
        !selectedRoleIds?.includes(role.id)
    );
    const addedRoles = roles?.filter(
      (role) =>
        !getRule(role, permission, projectId) &&
        selectedRoleIds?.includes(role.id)
    );

    for (const role of removedRoles ?? []) {
      const rule = getRule(role, permission, projectId);
      await deleteRule(rule!.id);
    }

    for (const role of addedRoles ?? []) {
      await createRule({ permission, projectId, roleId: role.id });
    }

    const hasFallbackRolePermission = selectedRoleIds?.some(
      (roleId) => roles?.find((r) => r.id === roleId)?.fallback
    );

    await onSaved?.(hasFallbackRolePermission);
    message.success("Permissions updated!");
  }, [selectedRoleIds, onSaved, createRule]);

  const buttonDisabled = useMemo(
    () => !!isSubmitDisabled?.(selectedRoleIds ?? []),
    [selectedRoleIds, isSubmitDisabled]
  );
  const button = (
    <Button
      type="primary"
      disabled={buttonDisabled}
      loading={saving}
      onClick={handleSave}
    >
      Save
    </Button>
  );

  return (
    <Space style={{ width: "100%" }}>
      <Select
        mode="multiple"
        defaultOpen={defaultOpen}
        placeholder="Select Roles..."
        style={{ minWidth: 240 }}
        showSearch
        disabled={disabled}
        optionFilterProp="label"
        loading={!roles}
        value={selectedRoleIds}
        onChange={setSelectedRoleIds}
      >
        {roles?.map((role) => (
          <Select.Option key={role.id} value={role.id} label={role.name}>
            {role.name}
          </Select.Option>
        ))}
      </Select>

      {!disabled &&
        (!!saveButtonTooltip ? (
          <Tooltip title={saveButtonTooltip} placement="bottom">
            {button}
          </Tooltip>
        ) : (
          button
        ))}
    </Space>
  );
};
