import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Space, Typography } from "antd";
import React, { FC } from "react";
import { UserTaskBoard } from "../user/UserTaskBoard";

interface Props {}

export const LandingPage: FC<Props> = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <Space direction="vertical">
      <Typography.Title
        level={3}
        style={{ textAlign: "center", width: "100%" }}
      >
        Your tasks for today
      </Typography.Title>
      <UserTaskBoard userId={user.id} />
    </Space>
  );
};
