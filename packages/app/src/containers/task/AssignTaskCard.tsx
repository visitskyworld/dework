import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { Task, TaskStatusEnum, User } from "@dewo/app/graphql/types";
import { Button, Card, List, Tooltip, Typography } from "antd";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString().split(",")[0];
  };

  return (
    <Card
      size="small"
      className="dewo-card-highlighted"
      style={{ marginTop: 16, marginBottom: 24 }}
    >
      <Typography.Text strong>Assign a contributor</Typography.Text>
      {task?.taskApplications.map((taskApplication) => (
        <List.Item
          actions={[
            <Button
              size="small"
              loading={loading}
              onClick={() => handleAssign(taskApplication.user)}
            >
              Assign
            </Button>,
          ]}
        >
          <a
            href={`/profile/${taskApplication.user.id}`}
            style={{ width: "100%" }}
            target="_blank"
            rel="noreferrer"
          >
            <Tooltip
              title={
                "Requesting task for: " +
                "\n" +
                formatDate(taskApplication.startDate) +
                " - " +
                formatDate(taskApplication.endDate) +
                "\n\n" +
                taskApplication.applicationMessage
              }
              overlayStyle={{ whiteSpace: "pre-line" }}
            >
              <List.Item.Meta
                avatar={
                  <UserAvatar
                    user={taskApplication.user}
                    tooltip={{ visible: false }}
                  />
                }
                title={taskApplication.user.username}
              />
            </Tooltip>
          </a>
        </List.Item>
      ))}
    </Card>
  );
};
