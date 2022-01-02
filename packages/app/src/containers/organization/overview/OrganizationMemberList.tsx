import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import React, { FC, useMemo } from "react";
import { OrganizationInviteButton } from "../../invite/OrganizationInviteButton";
import {
  useOrganization,
  useOrganizationContributors,
  useOrganizationCoreTeam,
  useRemoveOrganizationMember,
} from "../hooks";
import { Table, Space, Row, Button } from "antd";
import * as Icons from "@ant-design/icons";
import { OrganizationRole, User } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { eatClick } from "@dewo/app/util/eatClick";
import _ from "lodash";

interface Props {
  organizationId: string;
}

const roleToString: Partial<Record<OrganizationRole, string>> = {
  [OrganizationRole.ADMIN]: "Admin",
  [OrganizationRole.OWNER]: "Owner",
};

export const OrganizationMemberList: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
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

  const coreTeam = useOrganizationCoreTeam(organizationId);
  const contributors = useOrganizationContributors(organizationId);
  const contributorsWithoutCoreTeam = useMemo(
    () => contributors.filter((c) => !coreTeam.some((u) => u.id === c.id)),
    [contributors, coreTeam]
  );
  const users = useMemo(
    () => [...coreTeam, ...contributorsWithoutCoreTeam],
    [coreTeam, contributorsWithoutCoreTeam]
  );

  const organizationRoleByUserId = useMemo(
    () =>
      _(organization?.members)
        .keyBy((m) => m.user.id)
        .mapValues((m) =>
          m.role === OrganizationRole.FOLLOWER ? undefined : m.role
        )
        .value(),
    [organization?.members]
  );

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", paddingLeft: 16, paddingRight: 16 }}
    >
      <Row justify="end">
        <OrganizationInviteButton organizationId={organizationId} />
      </Row>

      <Table<User>
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
            render: (_, user: User) => <UserAvatar user={user} />,
          },
          { title: "Username", dataIndex: "username" },
          {
            title: "Role",
            dataIndex: "role",
            width: 1,
            render: (_, user: User) => {
              const role = organizationRoleByUserId[user.id];
              if (!role) return "Contributor";
              return roleToString[role];
            },
          },
          ...(canDeleteAdmin || canDeleteOwner
            ? [
                {
                  key: "delete",
                  width: 1,
                  render: (_: unknown, user: User) => {
                    const role = organizationRoleByUserId[user.id];
                    if (
                      (role === OrganizationRole.OWNER && canDeleteOwner) ||
                      (role === OrganizationRole.ADMIN && canDeleteAdmin)
                    ) {
                      return (
                        <Button
                          type="text"
                          icon={<Icons.DeleteOutlined />}
                          onClick={(event) => {
                            eatClick(event);
                            removeMember({ userId: user.id, organizationId });
                          }}
                        />
                      );
                    }
                  },
                },
              ]
            : []),
        ]}
      />
    </Space>
  );
};
