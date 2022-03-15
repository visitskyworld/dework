import { FormSection } from "@dewo/app/components/FormSection";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import { TaskDetails } from "@dewo/app/graphql/types";
import { Card, Divider, List } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useCreateTaskSubmission, useUpdateTaskSubmission } from "../hooks";
import { TaskSubmissionListItem } from "./TaskSubmissionListItem";

interface Props {
  task: TaskDetails;
}

export const TaskSubmissionsSection: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const can = usePermissionFn();

  const currentSubmission = useMemo(
    () => task.submissions.find((s) => s.user.id === user?.id),
    [task.submissions, user?.id]
  );
  const approvedSubmission = useMemo(
    () => task.submissions.find((s) => !!s.approver),
    [task.submissions]
  );

  const canSubmit = usePermission("submit", task);
  const canManageSubmissions = usePermission("update", task, "submissions");

  const createSubmission = useCreateTaskSubmission();
  const updateSubmission = useUpdateTaskSubmission();
  const handleSave = useCallback(
    async (content: string) => {
      if (!user) return;
      if (!currentSubmission) {
        await createSubmission({ taskId: task.id, content });
      } else {
        await updateSubmission({ userId: user.id, taskId: task.id, content });
      }
    },
    [user, task.id, currentSubmission, createSubmission, updateSubmission]
  );

  if (!canSubmit && !approvedSubmission) return null;
  if (!!approvedSubmission) {
    return (
      <>
        <Divider>Submissions</Divider>
        <FormSection label="Approved Submission">
          <Card size="small" className="dewo-card-highlighted">
            <TaskSubmissionListItem
              task={task}
              submission={approvedSubmission}
            />
          </Card>
        </FormSection>
      </>
    );
  }

  return (
    <>
      <Divider>Submissions</Divider>
      {canManageSubmissions && !!task.submissions.length && (
        <FormSection label="All Submissions">
          <Card size="small" className="dewo-card-highlighted">
            <List
              dataSource={task.submissions}
              renderItem={(submission) => (
                <TaskSubmissionListItem task={task} submission={submission} />
              )}
            />
          </Card>
        </FormSection>
      )}

      {canSubmit && (
        <FormSection label="Your Submission">
          <MarkdownEditor
            initialValue={currentSubmission?.content}
            placeholder="No submissions yet. Submit your work here."
            buttonText={
              !!currentSubmission ? "Edit submission" : "Add submission"
            }
            editable
            mode="update"
            onSave={handleSave}
          />
        </FormSection>
      )}
    </>
  );
};
