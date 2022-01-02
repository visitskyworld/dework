import React, { CSSProperties, FC, useCallback, useMemo } from "react";
import {
  Task,
  TaskStatusEnum,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import {
  Tag,
  Card,
  Avatar,
  Typography,
  Space,
  Row,
  Col,
  Button,
  Rate,
} from "antd";
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
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";

interface TaskCardProps {
  task: Task | TaskWithOrganization;
  style?: CSSProperties;
  showReview?: boolean;
}

export const TaskCard: FC<TaskCardProps> = ({ task, style, showReview }) => {
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
    <Card
      size="small"
      style={style}
      className="hover:component-highlight"
      onClick={navigateToTask}
    >
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
            {"project" in task && (
              <Tag
                className="bg-component"
                style={{ marginBottom: 4, paddingLeft: 0 }}
              >
                <OrganizationAvatar
                  organization={task.project.organization}
                  size={20}
                />
                <Typography.Text style={{ marginLeft: 4 }}>
                  {task.project.organization.name}
                </Typography.Text>
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
      {showReview && (
        <>
          <Row style={{ marginBottom: 4 }}>
            {!!task.review?.rating && (
              <Rate
                disabled
                defaultValue={task.review?.rating}
                style={{ fontSize: 15 }}
              />
            )}
          </Row>
          <Row>
            <Typography.Text>{task.review?.message}</Typography.Text>
          </Row>
        </>
      )}
    </Card>
  );
};
