import * as Icons from "@ant-design/icons";
import { Row, Space, Typography, Avatar } from "antd";
import React, { FC } from "react";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

export const LandingPageFooter: FC = () => {
  return (
    <Row
      className="max-w-xl mx-auto"
      style={{ padding: "64px 24px", width: "100%" }}
    >
      <Space>
        <Typography.Text>
          Have questions or feedback? Reach out on Twitter or Discord
        </Typography.Text>
        <a
          href="https://twitter.com/deworkxyz"
          target="_blank"
          rel="noreferrer"
        >
          <Avatar size="small">
            <Icons.TwitterOutlined />
          </Avatar>
        </a>
        <a href="https://discord.gg/gvfMCyxs" target="_blank" rel="noreferrer">
          <Avatar size="small">
            <DiscordIcon />
          </Avatar>
        </a>
      </Space>
    </Row>
  );
};
