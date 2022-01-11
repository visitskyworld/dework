import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import React, { FC, useMemo } from "react";
import { OrganizationInviteButton } from "../../invite/OrganizationInviteButton";
import { useOrganization, useRemoveOrganizationMember } from "../hooks";
import { Table, Space, Row, Button } from "antd";
import * as Icons from "@ant-design/icons";
import { OrganizationMember, OrganizationRole } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { eatClick } from "@dewo/app/util/eatClick";

interface Props {
  organizationId: string;
}

export const organizationRoleToString: Partial<
  Record<OrganizationRole, string>
> = {
  [OrganizationRole.ADMIN]: "Admin",
  [OrganizationRole.OWNER]: "Owner",
};

export const OrganizationMemberList: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganization(organizationId);
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

  const members = useMemo(
    () =>
      organization?.members.filter((m) => m.role !== OrganizationRole.FOLLOWER),
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

      <Table<OrganizationMember>
        dataSource={members}
        size="small"
        showHeader={false}
        pagination={{ hideOnSinglePage: true }}
        onRow={(m) => ({ onClick: () => navigateToProfile(m.user) })}
        style={{ cursor: "pointer" }}
        columns={[
          {
            key: "avatar",
            width: 1,
            render: (_, m: OrganizationMember) => <UserAvatar user={m.user} />,
          },
          { title: "Username", dataIndex: ["user", "username"] },
          {
            title: "Role",
            dataIndex: "role",
            width: 1,
            render: (role: OrganizationRole) => organizationRoleToString[role],
          },
          ...(canDeleteAdmin || canDeleteOwner
            ? [
                {
                  key: "delete",
                  width: 1,
                  render: (_: unknown, m: OrganizationMember) => (
                    <Button
                      type="text"
                      icon={<Icons.DeleteOutlined />}
                      onClick={(event) => {
                        eatClick(event);
                        removeMember({ userId: m.user.id, organizationId });
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
