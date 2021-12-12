import React, { FC } from "react";
import { Menu, Modal } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import { UserSettings } from "../../user/UserSettings";

interface HeaderProfileDropdownProps {}

export const HeaderProfileDropdown: FC<HeaderProfileDropdownProps> = ({}) => {
  const { user, logout } = useAuthContext();
  const userSettings = useToggle();

  if (!user) return null;
  return (
    <>
      <Menu theme="dark">
        <Menu.Item
          icon={<Icons.SettingOutlined />}
          onClick={userSettings.onToggleOn}
        >
          Settings
        </Menu.Item>
        <Menu.Item icon={<Icons.LogoutOutlined />} onClick={logout}>
          Log out
        </Menu.Item>
      </Menu>
      <Modal
        visible={userSettings.value}
        title="Settings"
        footer={null}
        onCancel={userSettings.onToggleOff}
      >
        <UserSettings />
      </Modal>
    </>
  );
};
