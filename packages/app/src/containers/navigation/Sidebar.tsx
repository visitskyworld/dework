import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { SidebarOrganizationAvatar } from "./SidebarOrganizationAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Button, Col, Divider, Layout, Tooltip } from "antd";
import { HeaderProfileAvatar } from "./header/HeaderProfileAvatar";
import { CreateOrganizationButton } from "./CreateOrganizationButton";
import { SidebarNavLink } from "./SidebarNavLink";
import { useSidebarContext } from "@dewo/app/contexts/sidebarContext";
import Link from "next/link";
import { isSSR } from "@dewo/app/util/isSSR";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  const { isOn, setToggle } = useSidebarContext();
  const isProfileSetup = !!user?.bio || !!user?.details.length;

  if (!user) return null;
  if (isSSR) return null;
  return (
    <Layout.Sider
      collapsible
      breakpoint="sm"
      onBreakpoint={setToggle}
      width={72}
      collapsedWidth="0"
      collapsed={isOn}
      trigger={null}
      className="dewo-divider-right"
    >
      <Col
        style={{
          height: "100%",
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SidebarNavLink
          href={user.permalink}
          className="dewo-sidebar-item"
          clickable={false}
        >
          <HeaderProfileAvatar />
        </SidebarNavLink>

        {!isProfileSetup && (
          <Link href={user.permalink}>
            <a>
              <Button
                size="small"
                type="primary"
                name="Setup Profile from Sidebar"
                className="ant-typography-caption"
                style={{ paddingLeft: 2, paddingRight: 2, border: "none" }}
              >
                Setup profile
              </Button>
            </a>
          </Link>
        )}

        <Divider style={{ margin: "12px 0" }} />

        <Col style={{ flex: 1, overflowX: "hidden", overflowY: "auto" }}>
          {user?.organizations.map((organization) => (
            <SidebarNavLink
              key={organization.id}
              href={organization.permalink}
              className="dewo-sidebar-item"
            >
              <SidebarOrganizationAvatar organization={organization} />
            </SidebarNavLink>
          ))}

          <Tooltip title="Create Organization" placement="right">
            <CreateOrganizationButton type="text" className="dewo-sidebar-item">
              <Avatar size={48} icon={<Icons.PlusOutlined />} />
            </CreateOrganizationButton>
          </Tooltip>
        </Col>
      </Col>
    </Layout.Sider>
  );
};
