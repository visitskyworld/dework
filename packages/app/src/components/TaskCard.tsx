import React, { FC } from "react";
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
} from "antd";
import * as Icons from "@ant-design/icons";
import { useSignPayout } from "../util/ethereum";
import { Task } from "../types/Task";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  const signPayout = useSignPayout();
  return (
    <Link href="#">
      <a>
        <Card size="small">
          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<Icons.DollarOutlined />}
                  onClick={() =>
                    signPayout(
                      "0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6",
                      1000
                    )
                  }
                >
                  Pay and close
                </Menu.Item>
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
            <Row>
              <Typography.Text type="secondary">
                {task.subtitle}
              </Typography.Text>
            </Row>
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
