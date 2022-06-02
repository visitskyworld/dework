import { FormSection } from "@dewo/app/components/FormSection";
import { RichMarkdownEditor } from "@dewo/app/components/richMarkdownEditor/RichMarkdownEditor";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  TaskSubmissionStatus,
  TaskDetails,
  TaskGatingType,
} from "@dewo/app/graphql/types";
import { Card, Divider, List, Typography } from "antd";
import _ from "lodash";
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
  const submissions = useMemo(
    () => _.groupBy(task.submissions, (s) => s.status),
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

  if (!canSubmit && !submissions[TaskSubmissionStatus.ACCEPTED]?.length) {
    return null;
  }

  const components = [
    submissions[TaskSubmissionStatus.ACCEPTED]?.length && (
      <FormSection key="approved" label="Approved Submissions">
        <Card size="small" className="dewo-card-highlighted">
          <List
            dataSource={submissions[TaskSubmissionStatus.ACCEPTED]}
            renderItem={(submission) => (
              <TaskSubmissionListItem task={task} submission={submission} />
            )}
          />
        </Card>
      </FormSection>
    ),
    canManageSubmissions &&
      !task.submissions.length &&
      task.gating === TaskGatingType.OPEN_SUBMISSION && (
        <Typography.Paragraph key="empty" type="secondary">
          No submissions to review
        </Typography.Paragraph>
      ),
    canManageSubmissions &&
      !!submissions[TaskSubmissionStatus.PENDING]?.length && (
        <FormSection key="all" label="Pending Submissions">
          <Card size="small" className="dewo-card-highlighted">
            <List
              dataSource={submissions[TaskSubmissionStatus.PENDING]}
              renderItem={(submission) => (
                <TaskSubmissionListItem task={task} submission={submission} />
              )}
            />
          </Card>
        </FormSection>
      ),
    !!currentSubmission && (
      <FormSection key="your" label="Your Submission">
        <RichMarkdownEditor
          initialValue={currentSubmission?.content}
          editable
          bordered
          mode="update"
          onSave={handleSave}
          placeholder="Write your submission here"
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
