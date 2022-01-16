import React, { FC } from "react";
import { Menu } from "antd";
import * as Icons from "@ant-design/icons";

const feedbackChannelInviteLink = "https://discord.gg/UX8UQGKqaf";
const communityChannelInviteLink = "https://discord.gg/fdeP4pN4nw";
const introChannelInviteLink = "https://discord.gg/FvxgCXWASA";

export const FeedbackDropdown: FC = () => (
  <Menu theme="dark">
    <Menu.Item icon={<Icons.BulbOutlined />}>
      <a href={feedbackChannelInviteLink} target="_blank" rel="noreferrer">
        Report feedback
      </a>
    </Menu.Item>
    <Menu.Item icon={<Icons.QuestionOutlined />}>
      <a href={communityChannelInviteLink} target="_blank" rel="noreferrer">
        Got question?
      </a>
    </Menu.Item>
    <Menu.Item icon={<Icons.RiseOutlined />}>
      <a href={introChannelInviteLink} target="_blank" rel="noreferrer">
        Get onboarded
      </a>
    </Menu.Item>
  </Menu>
);
