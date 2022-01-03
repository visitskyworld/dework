import React, { FC, useCallback, useMemo } from "react";
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
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import Link from "next/link";
import { TaskCard } from "../project/board/TaskCard";
import {
  useUpdateUser,
  useUser,
  useUpdateUserDetail,
  useUserTasks,
} from "./hooks";
import { TaskStatusEnum, UserDetailType } from "@dewo/app/graphql/types";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { EditUserAvatarButton } from "./EditUserAvatarButton";
import { UserDetails } from "./UserDetails";
import { useToggle } from "@dewo/app/util/hooks";

interface Props {
  userId: string;
}

export const UserProfile: FC<Props> = ({ userId }) => {
  const user = useUser(userId);
  const tasks = useUserTasks(userId);
  const completedTasks = useMemo(
    () => tasks?.filter((t) => t.status === TaskStatusEnum.DONE) ?? [],
    [tasks]
  );

  const currentUserId = useAuthContext().user?.id;
  const isMe = userId === currentUserId;
  const updateUser = useUpdateUser();
  const updateUserDetail = useUpdateUserDetail();
  const updateUsername = useCallback(
    (username: string) => updateUser({ username }),
    [updateUser]
  );
  const updateBio = useCallback(
    (bio: string) => updateUser({ bio }),
    [updateUser]
  );

  const [form] = Form.useForm();
  const editing = useToggle(false);
  const loading = useToggle(false);

  type InititalValues = Record<string, string>;

  const intitialValues: InititalValues = useMemo(
    () =>
      user?.details.reduce((a, v) => ({ ...a, [v.type]: v.value }), {}) ?? {},
    [user?.details]
  );

  const onSubmit = useCallback(
    async (values: InititalValues) => {
      try {
        loading.toggleOn();
        await Promise.all(
          Object.entries(values).map(([type, value]) =>
            updateUserDetail({ type: type as UserDetailType, value })
          )
        );
        message.success("Profile updated!");
      } catch {
        message.error("Failed to update user details");
      } finally {
        editing.toggleOff();
        loading.toggleOff();
      }
    },
    [editing, loading, updateUserDetail]
  );

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg" style={{ marginTop: 40 }}>
      <Row gutter={[16, 16]} style={{ margin: 0 }}>
        <Col xs={24} md={8}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              initialValues={intitialValues}
              onFinish={onSubmit}
            >
              <Space
                direction="vertical"
                style={{ position: "relative", maxWidth: "100%" }}
              >
                <Row style={{ position: "relative", display: "inline-block" }}>
                  <UserAvatar user={user} size={96} />
                  {editing.isOn && <EditUserAvatarButton />}
                </Row>

                <Typography.Title
                  level={3}
                  style={{ marginBottom: 0 }}
                  editable={
                    editing.isOn ? { onChange: updateUsername } : undefined
                  }
                >
                  {user.username}
                </Typography.Title>

                <Typography.Text
                  type="secondary"
                  editable={editing.isOn ? { onChange: updateBio } : undefined}
                >
                  {!!user.bio ? user.bio : "No bio..."}
                </Typography.Text>

                <UserDetails
                  isEditMode={editing.isOn}
                  userDetails={user.details}
                />

                <div style={{ marginTop: 6 }}>
                  {!!isMe && !!editing.isOn && (
                    <Space>
                      <Button
                        type="ghost"
                        size="small"
                        htmlType="submit"
                        loading={loading.isOn}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        onClick={editing.toggle}
                        disabled={loading.isOn}
                      >
                        Cancel
                      </Button>
                    </Space>
                  )}
                  {!!isMe && !editing.isOn && (
                    <Button type="ghost" onClick={editing.toggle} size="small">
                      Edit Profile
                    </Button>
                  )}
                </div>

                <Typography.Text
                  className="dewo-label"
                  style={{ marginTop: 16, display: "block" }}
                >
                  Proof of Work
                </Typography.Text>
                <Row gutter={[8, 8]} style={{ margin: 0 }}>
                  <Tag style={{ backgroundColor: Colors.volcano.primary }}>
                    <Icons.FireFilled />
                    <Typography.Text>
                      X% satisfaction (incoming metric..)
                    </Typography.Text>
                  </Tag>
                  <Tag style={{ backgroundColor: Colors.blue.primary }}>
                    <Icons.DollarCircleOutlined />
                    <Typography.Text>0 earned</Typography.Text>
                  </Tag>
                  {/* <Tag style={{ backgroundColor: Colors.magenta.primary }}>
                    <Icons.CheckCircleOutlined />
                    <Typography.Text>3 tasks completed</Typography.Text>
                  </Tag> */}
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
                  showReview
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
