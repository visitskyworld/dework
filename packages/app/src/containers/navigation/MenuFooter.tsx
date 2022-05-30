import React, { FC } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Col, Dropdown, Menu, Modal, Row, Typography } from "antd";
import Link from "next/link";
import * as Icons from "@ant-design/icons";
import { BlockButton } from "@dewo/app/components/BlockButton";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import {
  useCopyToClipboardAndShowToast,
  useToggle,
} from "@dewo/app/util/hooks";
import { UserSettings } from "../user/UserSettings";
import { ThreepidSource } from "@dewo/app/graphql/types";
import { shortenedAddress } from "../payment/hooks";

export const UserWalletAddress: FC<{ onShowSettings: () => void }> = ({
  onShowSettings,
}) => {
  const { user } = useAuthContext();
  const discordConnected = user?.threepids.some(
    (t) => t.source === ThreepidSource.discord
  );
  const ethWalletAddress = user?.threepids.find(
    (t) => t.source === ThreepidSource.metamask
  );
  const copy = useCopyToClipboardAndShowToast(
    "Copied wallet address to clipboard"
  );
  if (discordConnected && ethWalletAddress) {
    return (
      <Typography.Text
        onClick={() => copy(ethWalletAddress.threepid)}
        type="secondary"
        children={shortenedAddress(ethWalletAddress.threepid)}
      />
    );
  }
  return (
    <Typography.Link onClick={onShowSettings}>
      {discordConnected ? "Connect wallet" : "Connect Discord"}
    </Typography.Link>
  );
};

export const MenuFooter: FC = () => {
  const { user, logout } = useAuthContext();
  const userSettings = useToggle();

  if (!user) return null;
  return (
    <Row
      style={{
        paddingRight: 4,
        paddingLeft: 4,
        paddingBottom: 8,
        paddingTop: 8,
      }}
    >
      <Row gutter={8} align="middle" className="w-full pl-2">
        <Col>
          <UserAvatar user={user} linkToProfile />
        </Col>
        <Col style={{ flex: 1, overflow: "hidden" }}>
          <Row>
            <Link href={user?.permalink ?? ""}>
              <a href={user?.permalink} style={{ width: "100%" }}>
                <Typography.Text ellipsis className="font-semibold">
                  {user.username}
                </Typography.Text>
              </a>
            </Link>
          </Row>
          <Row>
            <UserWalletAddress onShowSettings={userSettings.toggleOn} />
          </Row>
        </Col>
        <Col>
          <Dropdown
            trigger={["click"]}
            placement="topRight"
            overlay={
              <Menu>
                <Menu.Item
                  icon={<Icons.SettingOutlined />}
                  onClick={userSettings.toggleOn}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  icon={<Icons.LogoutOutlined />}
                  onClick={() => logout()}
                >
                  Log out
                </Menu.Item>
              </Menu>
            }
          >
            <BlockButton
              style={{ paddingLeft: 8, paddingRight: 8 }}
              active={userSettings.isOn}
            >
              <Icons.SettingOutlined />
            </BlockButton>
          </Dropdown>
        </Col>
      </Row>
      <Modal
        visible={userSettings.isOn}
        title="Settings"
        footer={null}
        onCancel={userSettings.toggleOff}
      >
        <UserSettings />
      </Modal>
    </Row>
  );
};
