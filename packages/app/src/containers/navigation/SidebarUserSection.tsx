import React, { FC } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Space } from "antd";
import * as Icons from "@ant-design/icons";
import { BlockButton } from "@dewo/app/components/BlockButton";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useToggle } from "@dewo/app/util/hooks";
import { LoginModal } from "../auth/LoginModal";
import { SidenavHeader } from "./SidenavHeader";

export const SidebarUserSection: FC = () => {
  const { user } = useAuthContext();
  const loginModalVisible = useToggle();
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
          href="/dashboard"
          exact
          disabled={!user}
        >
          Dashboard
        </BlockButton>
        <BlockButton
          icon={<Icons.ProjectOutlined />}
          href={user && `${user.permalink}/board`}
          disabled={!user}
        >
          My Task Board
        </BlockButton>
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
