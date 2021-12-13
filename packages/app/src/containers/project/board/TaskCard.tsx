import React, { FC, useMemo } from "react";
import { Tag, Card, Avatar, Typography, Space, Row, Col, Button } from "antd";
import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { eatClick } from "@dewo/app/util/eatClick";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useNavigateToTask } from "@dewo/app/util/navigation";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ClaimTaskButton } from "./ClaimTaskButton";
import { PayAndCloseButton } from "./PayAndCloseButton";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  const navigateToTask = useNavigateToTask(task.id);

  const canClaimTask = usePermission("claimTask", task);
  const canUpdateTask = usePermission("update", task);
  const button = useMemo(() => {
    if (
      task.status === TaskStatusEnum.IN_REVIEW &&
      !!task.reward &&
      canUpdateTask
    ) {
      return <PayAndCloseButton task={task} />;
    }

    if (task.status === TaskStatusEnum.TODO) {
      if (canUpdateTask && !!task.assignees.length) {
        return (
          <Button
            size="small"
            type="primary"
            icon={<Icons.LockOutlined />}
            onClick={navigateToTask}
          >
            Pick contributor
          </Button>
        );
      }

      if (canClaimTask) {
        return <ClaimTaskButton task={task} />;
      }
    }

    return null;
  }, [task, navigateToTask, canClaimTask, canUpdateTask]);

  return (
    <Card size="small" onClick={navigateToTask}>
      <Row>
        <Space
          direction="vertical"
          size={4}
          style={{ flex: 1, width: "100%", marginBottom: 4 }}
        >
          <Row>
            <Typography.Text strong>{task.name}</Typography.Text>
          </Row>
          <Row>
            {!!task.reward && (
              <Tag
                style={{
                  marginBottom: 4,
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <Icons.DollarOutlined />
                <span>
                  {task.reward.amount} {task.reward.currency}
                </span>
              </Tag>
            )}
            {task.tags.map(({ label, color }, index) => (
              <Tag key={index} color={color} style={{ marginBottom: 4 }}>
                {label}
              </Tag>
            ))}
          </Row>
          {button}
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
          <div style={{ flex: 1 }} />
          <Avatar.Group maxCount={3} size={22}>
            {task.assignees.map((user) => (
              <UserAvatar key={user.id} user={user} />
            ))}
          </Avatar.Group>
        </Col>
      </Row>
    </Card>
  );
};
