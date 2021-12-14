import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Col, Divider, Dropdown, Layout } from "antd";
import React, { FC } from "react";
import { HeaderProfileDropdown } from "./header/HeaderProfileMenu";
import { CreateOrganizationButton } from "./CreateOrganizationButton";
import NavLink from "@dewo/app/components/NavLink";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  if (!user) return null;
  return (
    <Layout.Sider width={72}>
      <Col style={{ height: "100%", alignItems: "center", paddingBottom: 12 }}>
        <NavLink href="/" className="dewo-sidebar-item" exact>
          <Avatar size={48} icon={"/"} />
        </NavLink>
        <NavLink href={`/profile/${user.id}`} className="dewo-sidebar-item">
          <Dropdown
            key="avatar"
            placement="bottomLeft"
            overlay={<HeaderProfileDropdown />}
          >
            <UserAvatar user={user} size={48} tooltip={{ title: undefined }} />
          </Dropdown>
        </NavLink>

        <Divider />
        {user?.organizations.map((organization) => (
          <NavLink
            key={organization.id}
            href={`/organization/${organization.id}`}
            className="dewo-sidebar-item"
          >
            <OrganizationAvatar
              size={48}
              organization={organization}
              tooltip={{ placement: "right" }}
            />
          </NavLink>
        ))}
        <CreateOrganizationButton />
      </Col>
    </Layout.Sider>
  );
};
