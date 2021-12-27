import React, { CSSProperties, FC, useCallback, useMemo } from "react";
import { Tag, Card, Avatar, Typography, Space, Row, Col, Button } from "antd";
import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { eatClick } from "@dewo/app/util/eatClick";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useNavigateToTask } from "@dewo/app/util/navigation";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ClaimTaskButton } from "./ClaimTaskButton";
import Link from "next/link";
import { formatTaskReward, useUpdateTask } from "../../task/hooks";
import { PayButton } from "./PayButton";
import { useShouldShowInlinePayButton } from "./util";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../../auth/LoginButton";

interface TaskCardProps {
  task: Task;
  style?: CSSProperties;
}

export const TaskCard: FC<TaskCardProps> = ({ task, style }) => {
  const navigateToTask = useNavigateToTask(task.id);
  const currentUserId = useAuthContext().user?.id;

  const updateTask = useUpdateTask();
  const moveToDone = useCallback(
    () => updateTask({ id: task.id, status: TaskStatusEnum.DONE }, task),
    [updateTask, task]
  );

  const shouldShowInlinePayButton = useShouldShowInlinePayButton(task);
  const canClaimTask = usePermission("claimTask", task);
  const canUpdateTask = usePermission("update", task);
  const button = useMemo(() => {
    if (shouldShowInlinePayButton) {
      return <PayButton task={task}>Pay</PayButton>;
    }

    if (
      task.status === TaskStatusEnum.IN_REVIEW &&
      !!task.reward &&
      !task.reward.payment &&
      !!currentUserId &&
      task.ownerId === currentUserId
    ) {
      return (
        // <Space>
        //   <PayButton task={task} onDone={moveToDone}>
        //     {"Approve & Pay"}
        //   </PayButton>
        <Button
          size="small"
          onClick={(e) => {
            eatClick(e);
            moveToDone();
          }}
        >
          Approve
        </Button>
        // </Space>
      );
    }

    if (task.status === TaskStatusEnum.TODO) {
      if (canUpdateTask) {
        if (!!task.applications.length) {
          return (
            <Button
              size="small"
              type="primary"
              icon={<Icons.LockOutlined />}
              onClick={navigateToTask}
            >
              Pick applicant
            </Button>
          );
        }
      } else if (canClaimTask) {
        return <ClaimTaskButton task={task} />;
      } else {
        return (
          <LoginButton size="small" icon={<Icons.UnlockOutlined />}>
            Apply
          </LoginButton>
        );
      }
    }

    return null;
  }, [
    task,
    shouldShowInlinePayButton,
    navigateToTask,
    moveToDone,
    canClaimTask,
    canUpdateTask,
    currentUserId,
  ]);

  return (
    <Card size="small" style={style} onClick={navigateToTask}>
      <Row>
        <Space
          direction="vertical"
          size={4}
          style={{ flex: 1, width: "100%", marginBottom: 4 }}
        >
          <Row>
            <Typography.Text strong style={{ maxWidth: "100%" }}>
              {task.name}
            </Typography.Text>
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
                <span>{formatTaskReward(task.reward)}</span>
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

          {task.status === TaskStatusEnum.TODO && !task.assignees.length ? (
            canUpdateTask ? (
              <Avatar.Group maxCount={3} size={22}>
                {task.applications.map((application) => (
                  <Link
                    href={`/profile/${application.user.id}`}
                    key={application.id}
                  >
                    <a>
                      <UserAvatar user={application.user} />
                    </a>
                  </Link>
                ))}
              </Avatar.Group>
            ) : null
          ) : (
            <Avatar.Group maxCount={3} size={22}>
              {task.assignees.map((user) => (
                <Link href={`/profile/${user.id}`} key={user.id}>
                  <a>
                    <UserAvatar user={user} />
                  </a>
                </Link>
              ))}
            </Avatar.Group>
          )}
        </Col>
      </Row>
    </Card>
  );
};
