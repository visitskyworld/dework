import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { Avatar, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useUpdateUser, useUser, useUserTasks } from "./hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import Link from "next/link";
import { TaskCard } from "../project/board/TaskCard";
import { TaskStatusEnum } from "@dewo/app/graphql/types";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { EditUserAvatarButton } from "./EditUserAvatarButton";

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
    <div className="mx-auto max-w-lg" style={{ marginTop: 40 }}>
      <Row gutter={[16, 16]} style={{ margin: 0 }}>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Row style={{ position: "relative", display: "inline-block" }}>
                <UserAvatar user={user} size={96} />
                {isMe && <EditUserAvatarButton />}
              </Row>

              <Typography.Title
                level={3}
                style={{ marginBottom: 0 }}
                editable={isMe ? { onChange: updateUsername } : undefined}
              >
                {user.username}
              </Typography.Title>
              <Typography.Paragraph
                type="secondary"
                editable={isMe ? { onChange: updateBio } : undefined}
                ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
              >
                {!!user.bio ? user.bio : "No bio..."}
              </Typography.Paragraph>
              {/* {isMe && (
                <Button icon={<Icons.EditOutlined />}>Edit Profile</Button>
              )} */}

              <Space>
                {links.map((link, index) => (
                  <Link key={index} href={link.href}>
                    <a>
                      <Avatar size="small">{link.icon}</Avatar>
                    </a>
                  </Link>
                ))}
              </Space>

              <Typography.Text
                className="dewo-label"
                style={{ marginTop: 12, display: "block" }}
              >
                Proof of Work
              </Typography.Text>
              <Row gutter={[8, 8]} style={{ margin: 0 }}>
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
              </Row>

              {!!user.organizations.length && (
                <>
                  <Typography.Text
                    className="dewo-label"
                    style={{ marginTop: 12, display: "block" }}
                  >
                    Organizations
                  </Typography.Text>
                  <Row gutter={[8, 8]} style={{ margin: 0 }}>
                    {user.organizations.map((organization) => (
                      <Link
                        key={organization.id}
                        href={`/o/${organization.slug}`}
                      >
                        <a className="text-overflow-ellipsis">
                          <Tag className="text-overflow-ellipsis">
                            {organization.name}
                          </Tag>
                        </a>
                      </Link>
                    ))}
                  </Row>
                </>
              )}
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card size="small" title="Completed tasks">
            <Space direction="vertical" style={{ width: "100%" }}>
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Space>
          </Card>
          <TaskUpdateModalListener />
        </Col>
      </Row>
    </div>
  );
};
