import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { Task, TaskStatusEnum, User } from "@dewo/app/graphql/types";
import { Button, Card, List, Typography, Space, Tooltip } from "antd";
import moment from "moment";
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
          const startDate = moment(application.startDate);
          const endDate = moment(application.endDate);
          const days = moment.duration(endDate.diff(startDate)).asDays();

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
                <Tooltip title={application.user.username}>
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
                        startDate.format("DD/MM/YYYY") +
                        " - " +
                        endDate.format("DD/MM/YYYY") +
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
