import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Col, Divider, Dropdown, Layout } from "antd";
import React, { FC } from "react";
import { HeaderProfileDropdown } from "./header/HeaderProfileMenu";
import { CreateOrganizationButton } from "./CreateOrganizationButton";
import { SidebarNavLink } from "./SidebarNavLink";
import { useToggle } from "@dewo/app/util/hooks";
import { useSidebarContext } from "@dewo/app/contexts/sidebarContext";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  const showProfileDropdown = useToggle();
  const { isOn, setToggle } = useSidebarContext();

  const handleBreakpoint = (changed: boolean) => {
    setToggle(changed);
  };
  if (!user) return null;
  return (
    <Layout.Sider
      collapsible
      breakpoint="sm"
      onBreakpoint={handleBreakpoint}
      width={72}
      collapsedWidth="0"
      collapsed={isOn}
      trigger={null}
    >
      <Col style={{ height: "100%", alignItems: "center", padding: "12px 0" }}>
        <SidebarNavLink
          href={`/profile/${user.id}`}
          className="dewo-sidebar-item"
          clickable={false}
        >
          <Dropdown
            key="avatar"
            placement="bottomLeft"
            visible={showProfileDropdown.isOn}
            // @ts-ignore
            onClick={showProfileDropdown.toggle}
            overlay={
              <HeaderProfileDropdown onClose={showProfileDropdown.toggleOff} />
            }
          >
            <UserAvatar
              user={user}
              size={48}
              tooltip={{ visible: false }}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        </SidebarNavLink>

        <Divider style={{ margin: "12px 0" }} />

        {user?.organizations.map((organization) => (
          <SidebarNavLink
            key={organization.id}
            href={`/o/${organization.slug}`}
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
