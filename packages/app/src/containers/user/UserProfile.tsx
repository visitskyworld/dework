import React, { FC, useCallback } from "react";
import { useUser } from "@dewo/app/util/hooks";
import * as Icons from "@ant-design/icons";
import { Image, Avatar, Col, Space, Typography } from "antd";
import { useMyTasks, useUpdateUser } from "./hooks";
import { useQuery } from "@apollo/client";
import { TaskBoard } from "../project/board/TaskBoard";

interface Props {}

export const UserProfile: FC<Props> = () => {
  const user = useUser();
  const updateUser = useUpdateUser();
  const updateUsername = useCallback(
    (username: string) => updateUser({ username }),
    [updateUser]
  );

  const myTasks = useMyTasks();

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
        <Typography.Title level={3} editable={{ onChange: updateUsername }}>
          {user.username}
        </Typography.Title>
        <Typography.Text editable={{ onChange: () => console.warn("update") }}>
          Lorem ipsum dolor sit amet
        </Typography.Text>
        {!!myTasks && <TaskBoard tasks={myTasks} />}
      </Space>
    </>
  );
};
