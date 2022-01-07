import * as Icons from "@ant-design/icons";
import { Layout, Space, Typography, Avatar } from "antd";
import React, { FC } from "react";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

export const LandingPageFooter: FC = () => {
  return (
    <Layout.Footer style={{ backgroundColor: "transparent" }}>
      <Typography.Paragraph style={{ textAlign: "center" }}>
        Have questions or feedback? Reach out on Twitter or Discord
      </Typography.Paragraph>
      <Space style={{ display: "flex", justifyContent: "center" }}>
        <a
          href="https://twitter.com/deworkxyz"
          target="_blank"
          rel="noreferrer"
        >
          <Avatar>
            <Icons.TwitterOutlined />
          </Avatar>
        </a>
        <a href="https://discord.gg/kehMfGMk" target="_blank" rel="noreferrer">
          <Avatar>
            <DiscordIcon />
          </Avatar>
        </a>
      </Space>
    </Layout.Footer>
  );
};
