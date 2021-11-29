import React, { FC, useCallback } from "react";
import Link from "next/link";
import {
  Tag,
  Card,
  Avatar,
  Typography,
  Space,
  Row,
  Col,
  Dropdown,
  Menu,
  Button,
} from "antd";
import * as Icons from "@ant-design/icons";
import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { useUpdateTask } from "../hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
// import { useSignPayout } from "../util/ethereum";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  // const { user } = useAuthContext();
  // const signPayout = useSignPayout();
  // const handlePayAndClose = useCallback(async () => {
  //   await signPayout("0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6", 1);
  //   onChange({ ...task, status: TaskStatus.DONE });
  // }, [onChange]);
  // const handleReserve = useCallback(() => {
  //   onChange({
  //     ...task,
  //     assignee: user,
  //     sortKey: Date.now().toString(),
  //   });
  // }, [user, task, onChange]);

  const { user } = useAuthContext();
  const updateTask = useUpdateTask();
  const claimTask = useCallback(async () => {
    if (!user) return;
    await updateTask(
      {
        id: task.id,
        status: TaskStatusEnum.IN_PROGRESS,
        assigneeIds: [user.id],
      },
      task
    );
  }, [task, user, updateTask]);

  return (
    <Link href="#">
      <a>
        <Card size="small">
          <Row>
            <Space direction="vertical" size={4} style={{ flex: 1 }}>
              <Row>
                <Typography.Text strong>{task.name}</Typography.Text>
              </Row>
              <Col>
                <Row>
                  <Typography.Text type="secondary">
                    {task.description}
                  </Typography.Text>
                </Row>
                {/* {!!task.assignee && (
                <Row>
                  <Space>
                    <Avatar
                      src={task.assignee.imageUrl}
                      size={16}
                      icon={<Icons.UserOutlined />}
                    />
                    <Typography.Text type="secondary">
                      Claimed
                    </Typography.Text>
                  </Space>
                </Row>
              )} */}
              </Col>
              <Row>
                {task.tags.map(({ label, color }, index) => (
                  <Tag key={index} color={color} style={{ marginBottom: 4 }}>
                    {/* <Tag key={index} color={`#${color}`} style={{ color: "black" }}> */}
                    {label}
                  </Tag>
                ))}
              </Row>
            </Space>
            <Col
              style={{
                marginBottom: -4,
                marginRight: -4,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Dropdown
                placement="bottomRight"
                overlay={
                  <Menu>
                    {task.status === TaskStatusEnum.IN_REVIEW && (
                      <Menu.Item
                        icon={<Icons.DollarOutlined />}
                        onClick={console.warn}
                      >
                        Pay and close
                      </Menu.Item>
                    )}
                    {!!user && (
                      <Menu.Item
                        icon={<Icons.ClockCircleOutlined />}
                        onClick={claimTask}
                      >
                        Claim
                      </Menu.Item>
                    )}
                  </Menu>
                }
              >
                <Button
                  type="text"
                  icon={<Icons.MoreOutlined />}
                  style={{ marginRight: -8, marginTop: -12 }}
                />
              </Dropdown>
              <div style={{ flex: 1 }} />
              <Avatar.Group maxCount={3} size={16}>
                {task.assignees.map((user) => (
                  <Avatar
                    key={user.id}
                    src={user.imageUrl}
                    icon={<Icons.UserOutlined />}
                  />
                ))}
              </Avatar.Group>
            </Col>
          </Row>
        </Card>
      </a>
    </Link>
  );
};
