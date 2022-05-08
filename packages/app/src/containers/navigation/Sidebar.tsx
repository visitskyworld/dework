import React, { FC, useEffect, useState } from "react";
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
import styles from "./Sidebar.module.less";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  const { isOn, setToggle } = useSidebarContext();
  const isProfileSetup = !!user?.bio || !!user?.details.length;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!user) return null;
  if (isSSR) return null;
  if (!mounted) return null;
  return (
    <Layout.Sider
      collapsible
      breakpoint="sm"
      onBreakpoint={setToggle}
      width={78}
      collapsedWidth="0"
      collapsed={isOn}
      trigger={null}
      className={styles.sidebar}
    >
      <Col
        style={{
          height: "100%",
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SidebarNavLink
          href={user.permalink}
          className={styles.item}
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

        <Divider style={{ margin: "12px 0", minWidth: "50%", width: "50%" }} />

        <Col style={{ flex: 1, overflowX: "hidden", overflowY: "auto" }}>
          {user?.organizations.map((organization) => (
            <SidebarNavLink
              key={organization.id}
              href={organization.permalink}
              clickable
              className={styles.item}
            >
              <SidebarOrganizationAvatar organization={organization} />
            </SidebarNavLink>
          ))}

          <Tooltip title="Create Organization" placement="right">
            <CreateOrganizationButton type="text" className={styles.item}>
              <Avatar size={48} icon={<Icons.PlusOutlined />} />
            </CreateOrganizationButton>
          </Tooltip>

          <SidebarNavLink href="/recommended" clickable className={styles.item}>
            <Button type="text" className={styles.item}>
              <Avatar size={48} icon={<Icons.CompassFilled />} />
            </Button>
          </SidebarNavLink>
        </Col>
      </Col>
    </Layout.Sider>
  );
};
