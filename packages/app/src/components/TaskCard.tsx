import React, { FC, useCallback } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  Button,
  Menu,
  Dropdown,
  Tag,
  Card,
  Typography,
  Space,
  Row,
  Avatar,
  Col,
} from "antd";
import * as Icons from "@ant-design/icons";
import { useSignPayout } from "../util/ethereum";
import { Task, TaskStatus } from "../types/api";
import { useAuthContext } from "../contexts/AuthContext";

interface TaskCardProps {
  task: Task;
  onChange(task: Task): void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, onChange }) => {
  const { user } = useAuthContext();
  const signPayout = useSignPayout();
  const handlePayAndClose = useCallback(async () => {
    await signPayout("0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6", 1000);
    onChange({ ...task, status: TaskStatus.DONE });
  }, []);
  const handleReserve = useCallback(() => {
    onChange({
      ...task,
      status: TaskStatus.IN_PROGRESS,
      assignee: user,
      sortKey: Date.now().toString(),
    });
  }, [user, task, onChange]);
  return (
    <Link href="#">
      <a>
        <Card size="small">
          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu>
                {task.status === TaskStatus.IN_REVIEW && (
                  <Menu.Item
                    icon={<Icons.DollarOutlined />}
                    onClick={handlePayAndClose}
                  >
                    Pay and close
                  </Menu.Item>
                )}
                {task.status === TaskStatus.TODO && !!user && (
                  <Menu.Item
                    icon={<Icons.ClockCircleOutlined />}
                    onClick={handleReserve}
                  >
                    Reserve (3 days)
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button
              type="text"
              style={{ position: "absolute", top: 0, right: 0 }}
              icon={<Icons.MoreOutlined />}
            />
          </Dropdown>
          <Space direction="vertical" size={4}>
            <Row>
              <Typography.Text strong>
                {task.title} ({task.sortKey})
              </Typography.Text>
            </Row>
            <Col>
              <Typography.Text type="secondary">
                {task.subtitle}
              </Typography.Text>
              {!!task.assignee && (
                <Space>
                  <Avatar
                    src={task.assignee.imageUrl}
                    size={16}
                    icon={<Icons.UserOutlined />}
                  />
                  <Typography.Text type="secondary">
                    Claimed by {task.assignee.name}
                  </Typography.Text>
                </Space>
              )}
            </Col>
            <Row>
              {task.tags.map(({ label, color }, index) => (
                <Tag key={index} color={color}>
                  {label}
                </Tag>
              ))}
            </Row>
          </Space>
        </Card>
      </a>
    </Link>
  );
};
