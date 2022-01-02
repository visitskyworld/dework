import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import React, { FC, useMemo } from "react";
import { OrganizationInviteButton } from "../../invite/OrganizationInviteButton";
import {
  useOrganization,
  useRemoveOrganizationMember,
  useUpdateOrganizationMember,
} from "../hooks";
import { Table, Space, Row, Button, Select } from "antd";
import * as Icons from "@ant-design/icons";
import { OrganizationMember, OrganizationRole } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { eatClick } from "@dewo/app/util/eatClick";
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
        onRow={(member) => ({
          onClick: () => navigateToProfile(member.user),
        })}
        style={{ cursor: "pointer" }}
        columns={[
          {
            key: "avatar",
            width: 1,
            render: (_, member: OrganizationMember) => (
              <UserAvatar user={member.user} />
            ),
          },
          {
            title: "Username",
            dataIndex: ["user", "username"],
          },
          {
            title: "Role",
            dataIndex: "role",
            width: 1,
            render: (
              currentRole: OrganizationRole,
              member: OrganizationMember
            ) => {
              if (!hasPermission("update", member)) {
                return roleToString[currentRole];
              }
              return (
                <Select
                  key={member.id}
                  defaultValue={currentRole}
                  style={{ width: "100%" }}
                  onClick={eatClick}
                  onChange={(role) =>
                    updateMember({
                      organizationId,
                      userId: member.user.id,
                      role,
                    })
                  }
                >
                  {[OrganizationRole.ADMIN, OrganizationRole.OWNER].map(
                    (role) => (
                      <Select.Option key={role} value={role}>
                        {roleToString[role]}
                      </Select.Option>
                    )
                  )}
                </Select>
              );
            },
          },
          ...(canDeleteMember
            ? [
                {
                  key: "delete",
                  width: 1,
                  render: (_: unknown, member: OrganizationMember) => (
                    <Button
                      type="text"
                      icon={<Icons.DeleteOutlined />}
                      onClick={(event) => {
                        eatClick(event);
                        removeMember({ userId: member.userId, organizationId });
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
