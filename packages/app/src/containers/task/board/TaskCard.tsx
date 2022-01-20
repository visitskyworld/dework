import React, { CSSProperties, FC } from "react";
import {
  Task,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Card, Avatar, Typography, Space, Row, Col, Rate } from "antd";
import { eatClick } from "@dewo/app/util/eatClick";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useNavigateToTask } from "@dewo/app/util/navigation";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import Link from "next/link";
import { TaskReactionPicker } from "./TaskReactionPicker";
import { TaskTagsRow } from "./TaskTagsRow";
import { TaskActionButton } from "./TaskActionButton";

interface TaskCardProps {
  task: Task | TaskWithOrganization;
  style?: CSSProperties;
  showReview?: boolean;
}

export const TaskCard: FC<TaskCardProps> = ({ task, style, showReview }) => {
  const navigateToTask = useNavigateToTask(task.id);
  const canUpdateTask = usePermission("update", task);
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
          size={6}
          style={{ flex: 1, width: "100%", marginBottom: 4 }}
        >
          <Row>
            <Typography.Text strong style={{ maxWidth: "100%" }}>
              {task.name}
            </Typography.Text>
          </Row>
          <TaskTagsRow task={task} />
          <TaskReactionPicker task={task} />
          <TaskActionButton task={task} />
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

          {task.status === TaskStatus.TODO && !task.assignees.length ? (
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
