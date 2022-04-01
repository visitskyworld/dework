import { RoleTag } from "@dewo/app/components/RoleTag";
import { ConnectOrganizationToDiscordButton } from "@dewo/app/containers/integrations/buttons/ConnectOrganizationToDiscordButton";
import { useOrganizationIntegrations } from "@dewo/app/containers/organization/hooks";
import { useProject } from "@dewo/app/containers/project/hooks";
import { useOrganizationRoles } from "@dewo/app/containers/rbac/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  OrganizationIntegrationType,
  RulePermission,
} from "@dewo/app/graphql/types";
import { Form, Select } from "antd";
import _ from "lodash";
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
    task: { projectId },
  });

  const { project } = useProject(projectId);
  const roles = useOrganizationRoles(project?.organizationId);
  const roleById = useMemo(() => _.keyBy(roles, (r) => r.id), [roles]);
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
          organizationId={project.organizationId}
        />
      </div>
    );
  }
  return (
    <Form.Item name={["gating", "roleIds"]}>
      <Select
        mode="multiple"
        placeholder="Select roles..."
        optionFilterProp="label"
        loading={!organizationRoles}
        disabled={disabled}
        tagRender={(props) => (
          <RoleTag {...props} role={roleById[props.value]} />
        )}
      >
        {organizationRoles?.map((role) => (
          <Select.Option
            key={role.id}
            value={role.id}
            label={role.name}
            style={{ fontWeight: "unset" }}
          >
            <RoleTag role={role} />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
