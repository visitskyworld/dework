import React, { FC } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Badge, Space } from "antd";
import * as Icons from "@ant-design/icons";
import { BlockButton } from "@dewo/app/components/BlockButton";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useToggle } from "@dewo/app/util/hooks";
import { LoginModal } from "../auth/LoginModal";
import { SidenavHeader } from "./SidenavHeader";
import { useNotificationUnreadCount } from "../notification/hooks";
import styles from "./Sidebar.module.less";
import { useIsDev } from "../user/hooks";

export const SidebarUserSection: FC = () => {
  const { user } = useAuthContext();
  const loginModalVisible = useToggle();
  const unreadCount = useNotificationUnreadCount();
  const isDev = useIsDev();
  return (
    <>
      <SidenavHeader
        href="/"
        title="Home"
        icon={user && <UserAvatar user={user} />}
      />
      <Space direction="vertical" className="pl-2 pr-2 w-full" size={2}>
        <BlockButton icon={<Icons.SearchOutlined />} href="/" exact>
          Discover
        </BlockButton>
        <BlockButton
          icon={<Icons.AppstoreOutlined />}
          href="/task-feed"
          exact
          disabled={!user}
        >
          Task Feed
        </BlockButton>
        <BlockButton
          icon={<Icons.ProjectOutlined />}
          href={user && `${user.permalink}/board`}
          disabled={!user}
        >
          My Task Board
        </BlockButton>
        {isDev && (
          <BlockButton
            icon={<Icons.BellOutlined />}
            href="/notifications"
            disabled={!user}
          >
            Inbox{" "}
            <Badge
              count={unreadCount}
              style={{ marginLeft: 8 }}
              className={styles.redBadge}
            />
          </BlockButton>
        )}
        <BlockButton
          icon={<Icons.UserOutlined />}
          exact
          href={user && user.permalink}
          disabled={!user}
        >
          Profile
        </BlockButton>
      </Space>

      <LoginModal toggle={loginModalVisible} />
    </>
  );
};
