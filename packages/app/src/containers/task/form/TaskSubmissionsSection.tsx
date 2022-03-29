import { FormSection } from "@dewo/app/components/FormSection";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskDetails } from "@dewo/app/graphql/types";
import { Card, Divider, List, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useCreateTaskSubmission, useUpdateTaskSubmission } from "../hooks";
import { TaskSubmissionListItem } from "./TaskSubmissionListItem";

interface Props {
  task: TaskDetails;
}

export const TaskSubmissionsSection: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
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
        await updateSubmission({
          userId: user.id,
          taskId: task.id,
          content,
          deletedAt: !content ? new Date().toISOString() : undefined,
        });
      }
    },
    [user, task.id, currentSubmission, createSubmission, updateSubmission]
  );

  if (!canSubmit && !approvedSubmission) return null;
  if (!!approvedSubmission) {
    return (
      <div>
        <Divider>Submissions</Divider>
        <FormSection label="Approved Submission">
          <Card size="small" className="dewo-card-highlighted">
            <TaskSubmissionListItem
              task={task}
              submission={approvedSubmission}
            />
          </Card>
        </FormSection>
      </div>
    );
  }

  const components = [
    canManageSubmissions &&
      !task.submissions.length &&
      task.options?.allowOpenSubmission && (
        <Typography.Paragraph type="secondary">
          No submissions yet
        </Typography.Paragraph>
      ),
    canManageSubmissions && !!task.submissions.length && (
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
    ),
    !!currentSubmission && (
      <FormSection label="Your Submission">
        <MarkdownEditor
          key={currentSubmission?.content}
          initialValue={currentSubmission?.content}
          placeholder="No submission yet. Submit your work here."
          buttonText={
            !!currentSubmission ? "Edit submission" : "Add submission"
          }
          editable
          mode="update"
          onSave={handleSave}
        />
      </FormSection>
    ),
  ].filter((c) => !!c);

  if (!components.length) return null;
  return (
    <div>
      <Divider>Submissions</Divider>
      {components}
    </div>
  );
};
