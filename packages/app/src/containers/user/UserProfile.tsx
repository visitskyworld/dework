import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { Image, Avatar, Space, Typography } from "antd";
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

  if (!user) return null;
  return (
    <>
      <Image
        width="100%"
        height={200}
        style={{ objectFit: "cover" }}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={false}
      />
      <Space direction="vertical" style={{ width: "100%", marginTop: -64 }}>
        <Avatar
          src={user.imageUrl}
          className="pointer-cursor"
          size={128}
          icon={<Icons.UserOutlined />}
        />
        <Typography.Title
          level={3}
          editable={isMe ? { onChange: updateUsername } : undefined}
        >
          {user.username}
        </Typography.Title>
        <Typography.Text
          editable={
            isMe ? { onChange: () => console.warn("update") } : undefined
          }
        >
          Lorem ipsum dolor sit amet
        </Typography.Text>
        {!!tasks && <TaskBoard tasks={tasks} />}
      </Space>
    </>
  );
};
