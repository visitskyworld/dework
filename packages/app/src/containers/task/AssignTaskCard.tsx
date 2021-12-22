import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { Task, TaskStatusEnum, User } from "@dewo/app/graphql/types";
import { Button, Card, List, Typography, Space, Tooltip } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useUpdateTask } from "./hooks";

interface Props {
  task: Task;
}

export const AssignTaskCard: FC<Props> = ({ task }) => {
  const [loading, setLoading] = useState(false);

  const updateTask = useUpdateTask();
  const handleAssign = useCallback(
    async (user: User) => {
      try {
        setLoading(true);
        await updateTask(
          {
            id: task.id,
            assigneeIds: [user.id],
            status: TaskStatusEnum.IN_PROGRESS,
          },
          task
        );
      } finally {
        setLoading(false);
      }
    },
    [updateTask, task]
  );

  return (
    <Card
      size="small"
      className="dewo-card-highlighted"
      style={{ marginTop: 16, marginBottom: 24 }}
    >
      <Typography.Text strong>Assign a contributor</Typography.Text>
      <List
        dataSource={task?.applications}
        renderItem={(application) => {
          const startDate = new Date(application.startDate);
          const endDate = new Date(application.endDate);
          const days =
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

          return (
            <List.Item
              actions={[
                <Button
                  size="small"
                  loading={loading}
                  onClick={() => handleAssign(application.user)}
                >
                  Assign
                </Button>,
              ]}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Tooltip title={application.user.username} placement="top">
                  <a
                    href={`/profile/${application.user.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <List.Item.Meta
                      avatar={
                        <UserAvatar
                          user={application.user}
                          tooltip={{ visible: false }}
                        />
                      }
                      title={application.user.username}
                      description={
                        startDate.toLocaleString("en-GB").split(",")[0] +
                        " - " +
                        endDate.toLocaleString("en-GB").split(",")[0] +
                        " (" +
                        days +
                        " days)"
                      }
                    />
                  </a>
                </Tooltip>
                <Typography.Text>{application.message}</Typography.Text>
              </Space>
            </List.Item>
          );
        }}
        // ))}
      />
    </Card>
  );
};
