import React, { FC, useCallback } from "react";
import { Dropdown, Menu, Typography, Avatar, Row } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { OrganizationCreateModal } from "../../organization/create/OrganizationCreateModal";
import { useToggle } from "@dewo/app/util/hooks";
import { useRouter } from "next/router";
import { Organization } from "@dewo/app/graphql/types";

interface HeaderProfileDropdownProps {}

export const HeaderProfileDropdown: FC<HeaderProfileDropdownProps> = ({}) => {
  const { user, logout } = useAuthContext();
  const createOrganization = useToggle();

  const router = useRouter();
  const navigateToOrganization = useCallback(
    async (id: string) =>
      await router.push(
        "/organization/[organizationId]",
        `/organization/${id}`
      ),
    [router]
  );
  const handleOrganizationCreated = useCallback(
    async (organization: Organization) => {
      createOrganization.onToggleOff();
      await navigateToOrganization(organization.id);
    },
    [createOrganization, navigateToOrganization]
  );

  if (!user) return null;
  return (
    <>
      <Menu>
        <Menu.Item icon={<Icons.LogoutOutlined />} onClick={logout}>
          Log out
        </Menu.Item>
        <Row style={{ padding: 16, paddingBottom: 4 }}>
          <Typography.Text strong>Organizations</Typography.Text>
        </Row>
        {user.organizations.map((organization) => (
          <Menu.Item
            key={organization.id}
            icon={
              <Avatar
                src={organization.imageUrl}
                size={14}
                icon={<Icons.TeamOutlined />}
              />
            }
            onClick={() => navigateToOrganization(organization.id)}
          >
            {organization.name}
          </Menu.Item>
        ))}
        <Menu.Item
          icon={<Icons.PlusOutlined />}
          onClick={createOrganization.onToggleOn}
        >
          Create Organization
        </Menu.Item>
      </Menu>
      <OrganizationCreateModal
        visible={createOrganization.value}
        onCancel={createOrganization.onToggleOff}
        onCreated={handleOrganizationCreated}
      />
    </>
  );
};
