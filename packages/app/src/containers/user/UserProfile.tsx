import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import Link from "next/link";
import { TaskCard } from "../project/board/TaskCard";
import { useUpdateUser, useUser, useUserTasks } from "./hooks";
import { TaskStatusEnum } from "@dewo/app/graphql/types";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { EditUserAvatarButton } from "./EditUserAvatarButton";
import { UserDetailsForm } from "./UserDetailsForm";

interface Props {
  userId: string;
}

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

  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) message.success("Profile updated!");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg" style={{ marginTop: 40 }}>
      <Row gutter={[16, 16]} style={{ margin: 0 }}>
        <Col xs={24} md={8}>
          <Card>
            <Form form={form} layout="vertical" autoComplete="off">
              <Form.Item
                key={"avatar"}
                style={{
                  position: "relative",
                  display: "inline-block",
                  margin: 0,
                }}
              >
                <UserAvatar user={user} size={96} />
                {isEditMode && <EditUserAvatarButton />}
              </Form.Item>
              <Form.Item key={"username"} style={{ margin: "8px 0 3px 0" }}>
                <Typography.Title
                  level={3}
                  style={{ marginBottom: 0 }}
                  editable={
                    isEditMode ? { onChange: updateUsername } : undefined
                  }
                >
                  {user.username}
                </Typography.Title>
              </Form.Item>
              <Form.Item key={"bio"} style={{ margin: 0 }}>
                <Typography.Text
                  type="secondary"
                  editable={isEditMode ? { onChange: updateBio } : undefined}
                >
                  {!!user.bio ? user.bio : "No bio..."}
                </Typography.Text>
              </Form.Item>

              <UserDetailsForm
                isEditMode={isEditMode}
                userDetails={user.details}
              />

              {!!isMe && (
                <Button onClick={toggleEditMode} style={{ width: "100%" }}>
                  {isEditMode ? "Save" : "Edit profile"}
                </Button>
              )}

              <Space direction="vertical">
                <Typography.Text
                  className="dewo-label"
                  style={{ marginTop: 16, display: "block" }}
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
                          <a>
                            <Tag>{organization.name}</Tag>
                          </a>
                        </Link>
                      ))}
                    </Row>
                  </>
                )}
              </Space>
            </Form>
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
