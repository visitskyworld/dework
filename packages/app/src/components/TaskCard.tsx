import React, { FC, useCallback } from "react";
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
    await signPayout("0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6", 1);
    onChange({ ...task, status: TaskStatus.DONE });
  }, [onChange, signPayout, task]);
  const handleReserve = useCallback(() => {
    onChange({
      ...task,
      status: TaskStatus.RESERVED,
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
              <Typography.Text strong>{task.title}</Typography.Text>
            </Row>
            <Col>
              <Row>
                <Typography.Text type="secondary">
                  {task.subtitle}
                </Typography.Text>
              </Row>
              {!!task.assignee && (
                <Row>
                  <Space>
                    <Avatar
                      src={task.assignee.imageUrl}
                      size={16}
                      icon={<Icons.UserOutlined />}
                    />
                    <Typography.Text type="secondary">
                      Claimed {/*task.assignee.name*/}
                    </Typography.Text>
                  </Space>
                </Row>
              )}
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
        </Card>
      </a>
    </Link>
  );
};
