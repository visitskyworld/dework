import React, { FC, useCallback } from "react";
import { Menu, Modal } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import { UserSettings } from "../../user/UserSettings";
import { useNavigateToProfile } from "@dewo/app/util/navigation";

interface Props {
  onClose(): void;
}

export const HeaderProfileDropdown: FC<Props> = ({ onClose }) => {
  const { user, logout } = useAuthContext();
  const userSettings = useToggle();
  const handleShowUserSettings = useCallback(() => {
    userSettings.toggleOn();
    onClose();
  }, [userSettings, onClose]);

  const navigateToProfile = useNavigateToProfile();
  const handleNavigateToProfile = useCallback(() => {
    navigateToProfile(user!);
    onClose();
  }, [navigateToProfile, onClose, user]);

  if (!user) return null;
  return (
    <>
      <Menu theme="dark">
        <Menu.Item
          icon={<Icons.UserOutlined />}
          onClick={handleNavigateToProfile}
        >
          Your Profile
        </Menu.Item>
        <Menu.Item
          icon={<Icons.SettingOutlined />}
          onClick={handleShowUserSettings}
        >
          Settings
        </Menu.Item>
        <Menu.Item icon={<Icons.LogoutOutlined />} onClick={logout}>
          Log out
        </Menu.Item>
      </Menu>
      <Modal
        visible={userSettings.isOn}
        title="Settings"
        footer={null}
        onCancel={userSettings.toggleOff}
      >
        <UserSettings />
      </Modal>
    </>
  );
};
