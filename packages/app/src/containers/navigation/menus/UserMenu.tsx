import React, { FC } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Badge, Menu } from "antd";
import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { MenuHeader } from "./MenuHeader";
import { useNotificationUnreadCount } from "../../notification/hooks";
import { useRouter } from "next/router";
import styles from "./Menu.module.less";

export const UserMenu: FC = () => {
  const { user } = useAuthContext();
  const unreadCount = useNotificationUnreadCount();
  const router = useRouter();

  const mainRoute = "/discover";

  if (!user) return null;
  return (
    <>
      <MenuHeader
        href="/"
        title="Home"
        icon={user && <UserAvatar user={user} />}
      />
      <Menu
        mode="inline"
        className={styles.menu}
        activeKey={router.asPath === "/" ? mainRoute : router.asPath}
        onSelect={({ key }) =>
          key === mainRoute ? router.push("/") : router.push(key)
        }
        items={[
          {
            label: "Discover",
            icon: <Icons.SearchOutlined />,
            key: mainRoute,
          },
          {
            label: "Task Feed",
            icon: <Icons.AppstoreOutlined />,
            key: "/task-feed",
          },
          {
            label: (
              <>
                Inbox
                <Badge
                  count={unreadCount}
                  style={{ marginLeft: 8 }}
                  className={styles.redBadge}
                />
              </>
            ),
            icon: <Icons.BellOutlined />,
            key: "/notifications",
          },
          {
            label: "My Task Board",
            icon: <Icons.ProjectOutlined />,
            key: `${new URL(user.permalink).pathname}/board`,
          },
          {
            label: "Profile",
            icon: <Icons.UserOutlined />,
            key: new URL(user.permalink).pathname,
          },
        ]}
      />
    </>
  );
};
