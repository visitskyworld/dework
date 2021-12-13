import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { Avatar, Card, Col, Space, Tag, Typography } from "antd";
import { useUpdateUser, useUser, useUserTasks } from "./hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import Link from "next/link";
import { TaskCard } from "../project/board/TaskCard";
import { TaskStatusEnum } from "@dewo/app/graphql/types";

interface Props {
  userId: string;
}

const links: { icon: ReactNode; href: string }[] = [
  {
    icon: <Icons.TwitterOutlined />,
    href: "#",
  },
  {
    icon: <Icons.GithubOutlined />,
    href: "#",
  },
  {
    icon: <Icons.LinkOutlined />,
    href: "#",
  },
  {
    icon: <Icons.LinkedinFilled />,
    href: "#",
  },
];

export const UserProfile: FC<Props> = ({ userId }) => {
  const user = useUser(userId);
  const tasks = useUserTasks(userId, "cache-and-network");
  const completedTasks = useMemo(
    () => tasks?.filter((t) => t.status === TaskStatusEnum.DONE) ?? [],
    [tasks]
  );

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
    <Col className="mx-auto max-w-sm" style={{ marginBottom: 48 }}>
      <Space size="large" align="start" style={{ width: "100%" }}>
        <UserAvatar user={user} size={128} />
        <Space direction="vertical">
          <Typography.Title
            level={3}
            style={{ marginBottom: 0 }}
            editable={isMe ? { onChange: updateUsername } : undefined}
          >
            {user.username}
          </Typography.Title>
          <Typography.Text
            type="secondary"
            editable={isMe ? { onChange: updateBio } : undefined}
          >
            {!!user.bio ? user.bio : "No bio..."}
          </Typography.Text>
          <Space>
            <Tag style={{ backgroundColor: Colors.volcano.primary }}>
              <Icons.FireFilled />
              <Typography.Text>80% satisfaction</Typography.Text>
            </Tag>
            <Tag style={{ backgroundColor: Colors.blue.primary }}>
              <Icons.DollarCircleOutlined />
              <Typography.Text>2500 earned</Typography.Text>
            </Tag>
            <Tag style={{ backgroundColor: Colors.magenta.primary }}>
              <Icons.CheckCircleOutlined />
              <Typography.Text>3 tasks completed</Typography.Text>
            </Tag>
          </Space>
          <Space>
            {links.map((link, index) => (
              <Link key={index} href={link.href}>
                <a>
                  <Avatar size="small">{link.icon}</Avatar>
                </a>
              </Link>
            ))}
          </Space>
        </Space>
      </Space>
      <Card size="small" title="Completed tasks" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {completedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Space>
      </Card>
    </Col>
  );
};
