import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Col, Divider, Dropdown, Layout } from "antd";
import React, { FC } from "react";
import { HeaderProfileDropdown } from "./header/HeaderProfileMenu";
import { CreateOrganizationButton } from "./CreateOrganizationButton";
import { SidebarNavLink } from "./SidebarNavLink";
import { useToggle } from "@dewo/app/util/hooks";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  const showProfileDropdown = useToggle();

  if (!user) return null;
  return (
    <Layout.Sider width={72}>
      <Col style={{ height: "100%", alignItems: "center", paddingBottom: 12 }}>
        <SidebarNavLink href="/" className="dewo-sidebar-item" exact>
          <Avatar size={48} icon={"/"} />
        </SidebarNavLink>
        <SidebarNavLink
          href={`/profile/${user.id}`}
          className="dewo-sidebar-item"
          clickable={false}
        >
          <Dropdown
            key="avatar"
            placement="bottomLeft"
            visible={showProfileDropdown.value}
            // @ts-ignore
            onClick={showProfileDropdown.toggle}
            overlay={
              <HeaderProfileDropdown onClose={showProfileDropdown.toggleOff} />
            }
          >
            <UserAvatar user={user} size={48} tooltip={{ title: undefined }} />
          </Dropdown>
        </SidebarNavLink>

        <Divider />
        {user?.organizations.map((organization) => (
          <SidebarNavLink
            key={organization.id}
            href={`/organization/${organization.id}`}
            className="dewo-sidebar-item"
          >
            <OrganizationAvatar
              size={48}
              organization={organization}
              tooltip={{ placement: "right" }}
            />
          </SidebarNavLink>
        ))}
        <CreateOrganizationButton />
      </Col>
    </Layout.Sider>
  );
};
