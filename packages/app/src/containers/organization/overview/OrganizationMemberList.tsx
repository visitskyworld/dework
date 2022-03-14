import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import React, { FC } from "react";
import { OrganizationInviteButton } from "../../invite/OrganizationInviteButton";
import { useOrganizationUsers, useRemoveOrganizationMember } from "../hooks";
import { Table, Space, Row, Button, Tag } from "antd";
import * as Icons from "@ant-design/icons";
import { OrganizationRole, Role, UserWithRoles } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { eatClick } from "@dewo/app/util/eatClick";

interface Props {
  organizationId: string;
}

export const organizationRoleToString: Record<OrganizationRole, string> = {
  [OrganizationRole.ADMIN]: "Admin",
  [OrganizationRole.OWNER]: "Owner",
  [OrganizationRole.FOLLOWER]: "Follower",
};

export const OrganizationMemberList: FC<Props> = ({ organizationId }) => {
  const users = useOrganizationUsers(organizationId);
  const removeMember = useRemoveOrganizationMember();

  const canDeleteAdmin = usePermission("delete", {
    __typename: "OrganizationMember",
    role: OrganizationRole.ADMIN,
  });
  const canDeleteOwner = usePermission("delete", {
    __typename: "OrganizationMember",
    role: OrganizationRole.OWNER,
  });

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
        dataSource={users}
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
            width: 1,
            render: (roles: Role[]) => (
              <Row>
                {roles.map((role) => (
                  <Tag key={role.id} color={role.color}>
                    {role.name}
                  </Tag>
                ))}
              </Row>
            ),
          },
          ...(canDeleteAdmin || canDeleteOwner
            ? [
                {
                  key: "delete",
                  width: 1,
                  render: (_: unknown, user: UserWithRoles) => (
                    <Button
                      type="text"
                      icon={<Icons.DeleteOutlined />}
                      onClick={(event) => {
                        eatClick(event);
                        removeMember({ userId: user.id, organizationId });
                      }}
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
    </Space>
  );
};
