import { Space, Typography } from "antd";
import React, { FC } from "react";
import { ProjectDiscordIntegrations } from "./ProjectDiscordIntegrations";

interface Props {}

export const ProjectSettings: FC<Props> = () => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Project Settings
      </Typography.Title>

      <Typography.Title level={4}>Discord Integrations</Typography.Title>
      <ProjectDiscordIntegrations />
    </Space>
  );
};
