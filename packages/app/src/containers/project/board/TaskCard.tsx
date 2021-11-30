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
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useSignPayout } from "@dewo/app/util/ethereum";
import { useRouter } from "next/router";
import { useUpdateTask } from "../../task/hooks";
import { eatClick } from "@dewo/app/util/eatClick";
// import { useSignPayout } from "../util/ethereum";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  // TODO(fant): move this out of here
  const { organizationId, projectId } = useRouter().query;

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
        // status: TaskStatusEnum.IN_PROGRESS,
        assigneeIds: [user.id],
      },
      task
    );
  }, [task, user, updateTask]);

  const signPayout = useSignPayout();
  const handlePayAndClose = useCallback(async () => {
    await signPayout("0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6", 1);
    updateTask({ id: task.id, status: TaskStatusEnum.DONE }, task);
  }, [signPayout, updateTask, task]);

  console.warn(task.name, task.reward);
  return (
    <Link
      href={`/organization/${organizationId}/project/${projectId}/task/${task.id}`}
    >
      <a>
        <Card size="small">
          <Row>
            <Space direction="vertical" size={4} style={{ flex: 1 }}>
              <Row>
                <Typography.Text strong>{task.name}</Typography.Text>
              </Row>
              <Row>
                {!!task.reward && (
                  <Tag color="#e89a3c" style={{ marginBottom: 4 }}>
                    <Icons.DollarOutlined />
                    <span>
                      {task.reward.amount} {task.reward.currency}
                    </span>
                  </Tag>
                )}
                {task.tags.map(({ label, color }, index) => (
                  <Tag key={index} color={color} style={{ marginBottom: 4 }}>
                    {/* <Tag key={index} color={`#${color}`} style={{ color: "black" }}> */}
                    {label}
                  </Tag>
                ))}
              </Row>
            </Space>
            <Col
              onClick={eatClick}
              style={{
                marginRight: -4,
                marginBottom: 4,
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
                        onClick={handlePayAndClose}
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
                  style={{ marginRight: -8, marginTop: -8 }}
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
