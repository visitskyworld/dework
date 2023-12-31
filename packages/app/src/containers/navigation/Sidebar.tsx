import React, { FC, useEffect, useState } from "react";
import * as Icons from "@ant-design/icons";
import { SidebarOrganizationAvatar } from "./SidebarOrganizationAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Badge, Button, Col, Divider, Layout, Tooltip } from "antd";
import { CreateOrganizationButton } from "./CreateOrganizationButton";
import { SidebarNavLink } from "./SidebarNavLink";
import { useSidebarContext } from "@dewo/app/contexts/SidebarContext";
import Link from "next/link";
import styles from "./Sidebar.module.less";
import { NavigationList } from "./NavigationList";
import classNames from "classnames";
import { useRouter } from "next/router";
import { LoginButton } from "../auth/buttons/LoginButton";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useNotificationUnreadCount } from "../notification/hooks";
import { useIsEmbedded } from "@dewo/app/util/navigation";

const OrganizationsStack: FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const isProfileSetup = !!user?.bio || !!user?.details.length;
  const unreadCount = useNotificationUnreadCount();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <Col
      style={{
        height: "100%",
        padding: "2px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <SidebarNavLink
        href="/"
        exact
        className={classNames(
          styles.item,
          ["/profile", "/task-feed", "/notifications"].some((p) =>
            router.pathname.startsWith(p)
          ) && styles.active
        )}
      >
        <Avatar className={styles.home} icon={<Icons.HomeFilled />} size={48} />
        <Badge count={unreadCount} className={styles.redBadge} />
      </SidebarNavLink>

      {user && !isProfileSetup && (
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

      <Divider style={{ margin: "4px 0", minWidth: "50%", width: "50%" }} />

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
          {user ? (
            <CreateOrganizationButton type="text" className={styles.item}>
              <Avatar size={48} icon={<Icons.PlusOutlined />} />
            </CreateOrganizationButton>
          ) : (
            <LoginButton type="text" className={styles.item}>
              <Avatar size={48} icon={<Icons.PlusOutlined />} />
            </LoginButton>
          )}
        </Tooltip>
      </Col>
    </Col>
  );
};

export const Sidebar: FC = () => {
  const { isOn, setToggle, toggleOn } = useSidebarContext();
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint.sm === true;
  const isMobile = breakpoint.sm === false;
  const isEmbedded = useIsEmbedded();
  const { user } = useAuthContext();

  const router = useRouter();
  useEffect(() => {
    if (isDesktop) return;

    router.events.on("routeChangeComplete", toggleOn);
    return () => router.events.off("routeChangeComplete", toggleOn);
  }, [isDesktop, router.events, toggleOn]);

  if (isEmbedded) return null;
  if (!user && ["/", "/bounties", "/recommended"].includes(router.route))
    return null;
  if (router.route.startsWith("/apps/") || router.route.startsWith("/auth/")) {
    return null;
  }
  return (
    <Layout.Sider
      collapsible
      breakpoint="sm"
      onBreakpoint={setToggle}
      collapsedWidth={!isDesktop ? 0 : 120}
      collapsed={isOn}
      trigger={null}
      className={styles.sidebar}
      width={isMobile ? "100%" : 300}
    >
      <div className="flex h-full">
        <OrganizationsStack />
        <NavigationList />
      </div>
    </Layout.Sider>
  );
};
