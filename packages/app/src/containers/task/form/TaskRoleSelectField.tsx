import { RoleTag } from "@dewo/app/components/RoleTag";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Form, Select, Tag } from "antd";
import _ from "lodash";
import React, { FC, useMemo } from "react";
import { useProject } from "../../project/hooks";
import { useOrganizationRoles } from "../../rbac/hooks";

interface Props {
  roleIds?: string[];
  projectId: string;
}

export const TaskRoleSelectField: FC<Props> = ({ roleIds, projectId }) => {
  const canManageRoles = usePermission("create", "Rule");
  const { project } = useProject(projectId);
  const roles = useOrganizationRoles(project?.organizationId);
  const roleById = useMemo(() => _.keyBy(roles, (r) => r.id), [roles]);
  const organizationRoles = useMemo(
    () => roles?.filter((role) => !role.userId && !role.fallback),
    [roles]
  );

  if (!canManageRoles && !roleIds?.length) return null;
  // TODO(fant): only show this if organization roles exist/Discord is connected
  return (
    <Form.Item
      name="roleIds"
      label={
        <>
          Gating
          <Tag
            color="green"
            style={{
              marginLeft: 4,
              fontWeight: "normal",
              textTransform: "none",
            }}
          >
            New
          </Tag>
        </>
      }
      tooltip="Let contributors with certain roles assign themselves to this task. Anyone can still apply to claim this task, but the selected roles can claim and start working on this without an application."
    >
      <Select
        mode="multiple"
        placeholder="Who can claim this task?"
        showSearch
        disabled={!canManageRoles}
        optionFilterProp="label"
        loading={!organizationRoles}
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
