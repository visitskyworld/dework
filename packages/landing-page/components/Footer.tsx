import * as Icons from "@ant-design/icons";
import { Layout, Space, Typography, Avatar } from "antd";
import React, { FC } from "react";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { deworkSocialLinks } from "@dewo/app/util/constants";

export const LandingPageFooter: FC = () => {
  return (
    <Layout.Footer className="bg-component">
      <Typography.Paragraph style={{ textAlign: "center" }}>
        Have questions or feedback? Reach out on Twitter or Discord
      </Typography.Paragraph>
      <Space style={{ display: "flex", justifyContent: "center" }}>
        <a href={deworkSocialLinks.twitter} target="_blank" rel="noreferrer">
          <Avatar>
            <Icons.TwitterOutlined />
          </Avatar>
        </a>
        <a href={deworkSocialLinks.discord} target="_blank" rel="noreferrer">
          <Avatar>
            <DiscordIcon />
          </Avatar>
        </a>
      </Space>
    </Layout.Footer>
  );
};
