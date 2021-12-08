import React, { FC, useCallback } from "react";
import Link from "next/link";
import { Tag, Card, Avatar, Typography, Space, Row, Col, Button } from "antd";
import * as Icons from "@ant-design/icons";
import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRouter } from "next/router";
import { useUpdateTask } from "../../task/hooks";
import { eatClick } from "@dewo/app/util/eatClick";
import { useProjectContext } from "@dewo/app/contexts/ProjectContext";
import { usePay } from "../../payment/hooks";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  // TODO(fant): move this out of here
  const { organizationId, projectId } = useRouter().query;

  const { user } = useAuthContext();
  const updateTask = useUpdateTask();
  const claimTask = useCallback(
    async (event) => {
      eatClick(event);
      if (!user) return;
      await updateTask(
        {
          id: task.id,
          // status: TaskStatusEnum.IN_PROGRESS,
          assigneeIds: [user.id],
        },
        task
      );
    },
    [task, user, updateTask]
  );

  const project = useProjectContext();
  const handlePay = usePay(project?.paymentMethod ?? undefined);
  const handlePayAndClose = useCallback(
    async (event) => {
      eatClick(event);
      const receiver = task.assignees[0];
      await handlePay(receiver.id, task.reward!);
      await updateTask({ id: task.id, status: TaskStatusEnum.DONE }, task);
    },
    [updateTask, handlePay, task]
  );

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
                  <Tag className="bg-primary" style={{ marginBottom: 4 }}>
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
              {task.status === TaskStatusEnum.IN_REVIEW &&
                !!task.assignees.length && (
                  <Button
                    size="small"
                    icon={<Icons.DollarOutlined />}
                    onClick={handlePayAndClose}
                  >
                    Pay and close
                  </Button>
                )}
              {!!user && task.status === TaskStatusEnum.TODO && (
                <Button
                  size="small"
                  icon={<Icons.ClockCircleOutlined />}
                  onClick={claimTask}
                >
                  Claim
                </Button>
              )}
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
              {/* <Dropdown
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
              </Dropdown> */}
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
