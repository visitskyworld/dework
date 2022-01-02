import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import React, { FC, useMemo } from "react";
import { OrganizationInviteButton } from "../../invite/OrganizationInviteButton";
import {
  useOrganization,
  useOrganizationContributors,
  useOrganizationCoreTeam,
  useRemoveOrganizationMember,
  useUpdateOrganizationMember,
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
  const updateMember = useUpdateOrganizationMember();
  const removeMember = useRemoveOrganizationMember();

  const canDeleteMember = usePermission("delete", {
    __typename: "OrganizationMember",
    // TODO(fant)
    role: OrganizationRole.FOLLOWER,
  });
  const hasPermission = usePermissionFn();

  const navigateToProfile = useNavigateToProfile();
  const members = useMemo(
    () =>
      organization?.members.filter((m) =>
        [OrganizationRole.ADMIN, OrganizationRole.OWNER].includes(m.role)
      ),
    [organization?.members]
  );

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
          ...(canDeleteMember
            ? [
                {
                  key: "delete",
                  width: 1,
                  render: (_: unknown, user: User) =>
                    !!organizationRoleByUserId[user.id] && (
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
