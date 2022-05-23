import { OpenDiscordButton } from "@dewo/app/components/OpenDiscordButton";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import {
  TaskApplication,
  TaskDetails,
  TaskGatingType,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { Button, Card, List, Typography, Space, Tooltip, Divider } from "antd";
import moment from "moment";
import React, { FC, useCallback, useState } from "react";
import { useDeleteTaskApplication, useUpdateTask } from "./hooks";

interface Props {
  task: TaskDetails;
}

export const TaskApplicationList: FC<Props> = ({ task }) => {
  const [loading, setLoading] = useState(false);

  const hasPermission = usePermissionFn();
  const deleteApplication = useDeleteTaskApplication();

  const updateTask = useUpdateTask();
  const handleAssign = useCallback(
    async (application: TaskApplication) => {
      try {
        setLoading(true);
        await updateTask(
          {
            id: task.id,
            assigneeIds: [application.user.id],
            status: TaskStatus.IN_PROGRESS,
            gating: TaskGatingType.ASSIGNEES,
            dueDate: application.endDate,
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
    <div>
      <Divider>Applications</Divider>
      <Card
        size="small"
        className="dewo-card-highlighted"
        style={{ marginTop: 16, marginBottom: 24 }}
      >
        <List
          dataSource={task?.applications}
          renderItem={(application) => {
            const startDate = moment(application.startDate);
            const endDate = moment(application.endDate);
            const days = moment.duration(endDate.diff(startDate)).asDays();

            return (
              <List.Item
                actions={[
                  <Space size={4} direction="vertical">
                    <Button
                      size="small"
                      loading={loading}
                      onClick={() => handleAssign(application)}
                    >
                      Assign
                    </Button>
                    {!!hasPermission("delete", application) && (
                      <Button
                        key="remove"
                        size="small"
                        type="text"
                        className="text-secondary"
                        onClick={() =>
                          deleteApplication({
                            taskId: task.id,
                            userId: application.userId,
                          })
                        }
                      >
                        Reject
                      </Button>
                    )}
                  </Space>,
                ]}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Tooltip title={application.user.username}>
                    <a
                      href={application.user.permalink}
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
                        title={<>{application.user.username}</>}
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
                  <Typography.Text style={{ wordBreak: "break-word" }}>
                    {application.message}
                  </Typography.Text>
                  {!!application.discordThreadUrl && (
                    <OpenDiscordButton href={application.discordThreadUrl}>
                      Discuss application
                    </OpenDiscordButton>
                  )}
                </Space>
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
};
