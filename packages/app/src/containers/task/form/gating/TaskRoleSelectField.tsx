import { RoleSelect } from "@dewo/app/components/form/RoleSelect";
import { ConnectOrganizationToDiscordButton } from "@dewo/app/containers/integrations/discord/ConnectOrganizationToDiscordButton";
import { useOrganizationIntegrations } from "@dewo/app/containers/organization/hooks";
import { useProject } from "@dewo/app/containers/project/hooks";
import { useOrganizationRoles } from "@dewo/app/containers/rbac/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  OrganizationIntegrationType,
  RulePermission,
} from "@dewo/app/graphql/types";
import { Form } from "antd";
import React, { FC, useMemo } from "react";

interface Props {
  roleIds?: string[];
  disabled: boolean;
  projectId: string;
}

export const TaskRoleSelectField: FC<Props> = ({
  roleIds,
  disabled,
  projectId,
}) => {
  const canManageRoles = usePermission("create", {
    __typename: "Rule",
    permission: RulePermission.MANAGE_TASKS,
    // @ts-ignore
    __task__: { projectId },
  });

  const { project } = useProject(projectId);
  const roles = useOrganizationRoles(project?.organizationId);
  const organizationRoles = useMemo(
    () => roles?.filter((role) => !role.userId && !role.fallback),
    [roles]
  );

  const hasDiscordIntegration = !!useOrganizationIntegrations(
    project?.organizationId,
    OrganizationIntegrationType.DISCORD
  )?.length;

  if (!project || (!canManageRoles && !roleIds?.length)) return null;
  if (!disabled && !hasDiscordIntegration) {
    return (
      <div style={{ marginBottom: 16 }}>
        <ConnectOrganizationToDiscordButton
          block
          size="small"
          organizationId={project.organizationId}
        />
      </div>
    );
  }
  return (
    <Form.Item
      name="roleIds"
      rules={[{ type: "array", min: 1, message: "Select at least one role" }]}
    >
      <RoleSelect
        roles={organizationRoles}
        organizationId={project.organizationId}
        placeholder="Select roles..."
        disabled={disabled || !canManageRoles}
      />
    </Form.Item>
  );
};
