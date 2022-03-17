import React, { FC, useMemo } from "react";
import { OrganizationInviteButton } from "../../invite/OrganizationInviteButton";
import { useOrganizationUsers } from "../hooks";
import { Table, Space, Row, Tag } from "antd";
import { Role, RulePermission, UserWithRoles } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useOrganizationRoles } from "../../rbac/hooks";

interface Props {
  organizationId: string;
}

export const OrganizationMemberList: FC<Props> = ({ organizationId }) => {
  const { users } = useOrganizationUsers(organizationId);
  const roles = useOrganizationRoles(organizationId);

  const adminRoleIds = useMemo(
    () =>
      roles
        ?.filter((role) =>
          role.rules.some(
            (rule) =>
              rule.permission === RulePermission.MANAGE_ORGANIZATION &&
              !rule.inverted
          )
        )
        .map((role) => role.id),
    [roles]
  );
  const adminUsers = useMemo(
    () =>
      users?.filter((u) => u.roles.some((r) => adminRoleIds?.includes(r.id))),
    [users, adminRoleIds]
  );

  const navigateToProfile = useNavigateToProfile();
  return (
    <Space
      direction="vertical"
      style={{ width: "100%", paddingLeft: 16, paddingRight: 16 }}
    >
      <Row justify="end">
        <OrganizationInviteButton organizationId={organizationId} />
      </Row>

      <Table<UserWithRoles>
        dataSource={adminUsers}
        size="small"
        showHeader={false}
        pagination={{ hideOnSinglePage: true }}
        onRow={(user) => ({ onClick: () => navigateToProfile(user) })}
        style={{ cursor: "pointer" }}
        columns={[
          {
            key: "avatar",
            width: 1,
            render: (_, user: UserWithRoles) => <UserAvatar user={user} />,
          },
          { title: "Username", dataIndex: "username" },
          {
            title: "Roles",
            dataIndex: "roles",
            render: (roles: Role[]) => (
              <Row style={{ justifyContent: "flex-end" }}>
                {roles
                  .filter((role) => !role.userId)
                  .map(
                    (role) =>
                      role.organizationId === organizationId && (
                        <Tag key={role.id} color={role.color}>
                          {role.name}
                        </Tag>
                      )
                  )}
              </Row>
            ),
          },
        ]}
      />
    </Space>
  );
};
