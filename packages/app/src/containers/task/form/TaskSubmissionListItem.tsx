import { RichMarkdownEditor } from "@dewo/app/components/richMarkdownEditor/RichMarkdownEditor";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  Task,
  TaskGatingType,
  TaskStatus,
  TaskSubmission,
} from "@dewo/app/graphql/types";
import { useRunning, useToggle } from "@dewo/app/util/hooks";
import { LocalStorage } from "@dewo/app/util/LocalStorage";
import { Button, List, Modal, Space, Tooltip, Typography } from "antd";
import moment from "moment";
import React, { FC, useCallback, useMemo, useState } from "react";
import {
  useCreateTask,
  useTask,
  useUpdateTask,
  useUpdateTaskSubmission,
} from "../hooks";

interface Props {
  task: Task;
  submission: TaskSubmission;
}

export const TaskSubmissionListItem: FC<Props> = ({ task, submission }) => {
  const { user } = useAuthContext();
  const canApprove = usePermission("update", task);
  const taskDetails = useTask(task.id).task;

  const updateTask = useUpdateTask();
  const updateSubmission = useUpdateTaskSubmission();
  const addTask = useCreateTask();

  const approveSingle = useCallback(
    async (submission: TaskSubmission) => {
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
    },
    [updateSubmission, updateTask, user?.id]
  );

  const approveMultiple = useCallback(
    async (submission) => {
      setShouldApprove(true);

      await updateSubmission({
        userId: submission.userId,
        taskId: submission.taskId,
        approverId: user?.id,
        deletedAt: new Date().toISOString(),
      });

      await addTask({
        name: task.name,
        description:
          `Approved submission for [${task.name}](${
            taskDetails!.permalink
          })\n\n---\n\n` + submission.content,
        parentTaskId: submission.taskId,
        status: TaskStatus.DONE,

        gating: TaskGatingType.ASSIGNEES,
        assigneeIds: [submission.userId],
        projectId: task.projectId,
        storyPoints: task.storyPoints,
        tagIds: task.tags.map((tag) => tag.id),
        ownerIds: task.owners.map((owner) => owner.id),
        // TODO(fant): support multiple rewards
        reward: !!task.rewards[0] && {
          amount: task.rewards[0].amount,
          peggedToUsd: task.rewards[0].peggedToUsd,
          tokenId: task.rewards[0].token.id,
        },
      });
    },
    [addTask, task, taskDetails, updateSubmission, user?.id]
  );

  const showModal = useToggle();

  const [handleApprove, approving] = useRunning(
    useCallback(
      async (submission: TaskSubmission, multiple: boolean) => {
        await (multiple
          ? approveMultiple(submission)
          : approveSingle(submission));
        showModal.toggleOff();
      },
      [approveMultiple, approveSingle, showModal]
    )
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

  const [_shouldApproveMultiple, setShouldApprove] = useState(false);
  const shouldApproveMultiple = useMemo(() => {
    const key = `Task.${task.id}.approveMultiple`;
    if (_shouldApproveMultiple) {
      LocalStorage.setItem(key, "true");
    }
    return LocalStorage.getItem(key) === "true";
  }, [task.id, _shouldApproveMultiple]);

  return (
    <>
      <List.Item
        key={submission.id}
        actions={[
          !submission.approver && (
            <Space size={4} direction="vertical" style={{ marginLeft: 8 }}>
              {canApprove && (
                <Button
                  size="small"
                  loading={approving}
                  onClick={
                    shouldApproveMultiple
                      ? () => handleApprove(submission, true)
                      : showModal.toggleOn
                  }
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
                Reject
              </Button>
            </Space>
          ),
        ]}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Tooltip title={submission.user.username}>
            <a
              href={submission.user.permalink}
              target="_blank"
              rel="noreferrer"
            >
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
          <RichMarkdownEditor
            initialValue={submission.content}
            editable={false}
          />
        </Space>
      </List.Item>
      <Modal
        visible={showModal.isOn}
        onCancel={showModal.toggleOff}
        title="Approve submission"
        footer={
          <>
            <Button
              type="primary"
              onClick={() => handleApprove(submission, false)}
            >
              Just this one
            </Button>
            <Button
              type="primary"
              onClick={() => handleApprove(submission, true)}
            >
              More than one
            </Button>
          </>
        }
      >
        <Typography.Paragraph style={{ margin: 0 }}>
          How many submissions do you want to approve?
        </Typography.Paragraph>
      </Modal>
    </>
  );
};
