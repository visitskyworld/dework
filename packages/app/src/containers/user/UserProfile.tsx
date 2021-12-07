import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { Image, Avatar, Space, Typography, Layout, Tabs, Col } from "antd";
import { useUpdateUser, useUser, useUserTasks } from "./hooks";
import { TaskBoard } from "../project/board/TaskBoard";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

interface Props {
  userId: string;
}

export const UserProfile: FC<Props> = ({ userId }) => {
  const user = useUser(userId);
  const tasks = useUserTasks(userId);

  const currentUserId = useAuthContext().user?.id;
  const isMe = userId === currentUserId;

  const updateUser = useUpdateUser();
  const updateUsername = useCallback(
    (username: string) => updateUser({ username }),
    [updateUser]
  );
  const updateBio = useCallback(
    (bio: string) => updateUser({ bio }),
    [updateUser]
  );

  if (!user) return null;
  return (
    <>
      <Image
        width="100%"
        height={200}
        style={{ objectFit: "cover" }}
        src="https://image.freepik.com/free-vector/gradient-liquid-abstract-background_23-2148902633.jpg"
        preview={false}
      />
      <Layout.Content className="max-w-sm mx-auto" style={{ marginTop: -64 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Avatar
            src={user.imageUrl}
            className="pointer-cursor"
            size={128}
            icon={<Icons.UserOutlined />}
          />
          <Col>
            <Typography.Title
              level={3}
              editable={isMe ? { onChange: updateUsername } : undefined}
            >
              {user.username}
            </Typography.Title>
            <Typography.Text
              editable={isMe ? { onChange: updateBio } : undefined}
            >
              {!user.bio && (
                <Typography.Text type="secondary">No bio...</Typography.Text>
              )}
              {user.bio}
            </Typography.Text>
          </Col>
        </Space>
      </Layout.Content>

      <Tabs defaultActiveKey="board" centered>
        <Tabs.TabPane tab="Activity" key="activity"></Tabs.TabPane>
        <Tabs.TabPane tab="Board" key="board">
          <Layout.Content className="max-w-lg mx-auto">
            {!!tasks && <TaskBoard tasks={tasks} />}
          </Layout.Content>
        </Tabs.TabPane>
        <Tabs.TabPane tab="About" key="about"></Tabs.TabPane>
      </Tabs>
    </>
  );
};
