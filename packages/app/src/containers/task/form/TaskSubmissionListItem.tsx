import { MarkdownPreview } from "@dewo/app/components/markdownEditor/MarkdownPreview";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task, TaskStatus, TaskSubmission } from "@dewo/app/graphql/types";
import { Button, List, Space, Tooltip } from "antd";
import moment from "moment";
import React, { FC, useCallback, useState } from "react";
import { useUpdateTask, useUpdateTaskSubmission } from "../hooks";

interface Props {
  task: Task;
  submission: TaskSubmission;
}

export const TaskSubmissionListItem: FC<Props> = ({ task, submission }) => {
  const { user } = useAuthContext();
  const canApprove = usePermission("update", task);

  const updateTask = useUpdateTask();
  const updateSubmission = useUpdateTaskSubmission();

  const [approving, setApproving] = useState(false);
  const handleApprove = useCallback(
    async (submission: TaskSubmission) => {
      setApproving(true);
      try {
        await updateSubmission({
          userId: submission.userId,
          taskId: submission.taskId,
          approverId: user?.id,
        });
        await updateTask({
          id: submission.taskId,
          assigneeIds: [submission.userId],
          status: TaskStatus.DONE,
        });
      } finally {
        setApproving(false);
      }
    },
    [updateSubmission, user?.id, updateTask]
  );

  const handleDelete = useCallback(
    async (submission: TaskSubmission) =>
      await updateSubmission({
        userId: submission.userId,
        taskId: submission.taskId,
        deletedAt: new Date().toISOString(),
      }),
    [updateSubmission]
  );

  return (
    <List.Item
      actions={[
        !submission.approver && (
          <Space size={4} direction="vertical" style={{ marginLeft: 8 }}>
            {canApprove && (
              <Button
                size="small"
                loading={approving}
                onClick={() => handleApprove(submission)}
              >
                Approve
              </Button>
            )}
            <Button
              key="remove"
              size="small"
              type="text"
              className="text-secondary"
              onClick={() => handleDelete(submission)}
            >
              Remove
            </Button>
          </Space>
        ),
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Tooltip title={submission.user.username}>
          <a href={submission.user.permalink} target="_blank" rel="noreferrer">
            <List.Item.Meta
              avatar={
                <UserAvatar
                  user={submission.user}
                  tooltip={{ visible: false }}
                />
              }
              title={submission.user.username}
              description={moment(submission.createdAt).calendar()}
            />
          </a>
        </Tooltip>
        <MarkdownPreview
          style={{ wordBreak: "break-all" }}
          value={submission.content}
        />
      </Space>
    </List.Item>
  );
};
