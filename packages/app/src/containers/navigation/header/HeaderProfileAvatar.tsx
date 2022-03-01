import React, { FC, useCallback } from "react";
import { Button, Dropdown, Menu, Modal } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import {
  useNavigateToProfile,
  useNavigateToUserTaskBoard,
} from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { UserSettings } from "../../user/UserSettings";

export const HeaderProfileAvatar: FC = () => {
  const { user, logout } = useAuthContext();
  const userSettings = useToggle();

  const navigateToProfile = useNavigateToProfile();
  const navigateToUserTaskBoard = useNavigateToUserTaskBoard();

  const handleNavigateToProfile = useCallback(
    () => navigateToProfile(user!),
    [navigateToProfile, user]
  );
  const handleNavigateToBoard = useCallback(
    () => navigateToUserTaskBoard(user!),
    [navigateToUserTaskBoard, user]
  );

  if (!user) return null;
  return (
    <>
      <Dropdown
        key="avatar"
        placement="bottomLeft"
        trigger={["click"]}
        overlay={
          <Menu>
            <Menu.Item
              icon={<Icons.UserOutlined />}
              onClick={handleNavigateToProfile}
            >
              My Profile
            </Menu.Item>
            <Menu.Item
              icon={<Icons.CheckCircleOutlined />}
              onClick={handleNavigateToBoard}
            >
              My Task Board
            </Menu.Item>
            <Menu.Item
              icon={<Icons.SettingOutlined />}
              onClick={userSettings.toggleOn}
            >
              Settings
            </Menu.Item>
            <Menu.Item icon={<Icons.LogoutOutlined />} onClick={logout}>
              Log out
            </Menu.Item>
          </Menu>
        }
      >
        <div style={{ position: "relative" }}>
          <UserAvatar
            user={user}
            size={48}
            tooltip={{ visible: false }}
            style={{ cursor: "pointer" }}
          />
          <Button
            icon={<Icons.SettingOutlined />}
            style={{ position: "absolute", right: -4, bottom: -4, margin: 0 }}
            shape="circle"
            type="primary"
            size="small"
            className="bg-body"
          />
        </div>
      </Dropdown>
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
