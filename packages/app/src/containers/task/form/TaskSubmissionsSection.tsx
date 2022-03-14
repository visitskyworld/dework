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
  const submissions = useMemo(
    () => task.submissions.filter((s) => can("read", s)),
    [task.submissions, can]
  );

  const currentSubmission = useMemo(
    () => submissions.find((s) => s.user.id === user?.id),
    [submissions, user?.id]
  );
  const approvedSubmission = useMemo(
    () => submissions.find((s) => !!s.approver),
    [submissions]
  );

  const canUpdate = usePermission("update", currentSubmission!);
  const canCreate = usePermission("create", task, "submissions");
  // TODO(fant): this isn't working properly... both assignee and owner can see everything
  const canReadAll = usePermission("read", task, "submissions");

  const showEditor =
    (canCreate && !currentSubmission) || (canUpdate && !!currentSubmission);

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

  if (!canReadAll && !showEditor && !approvedSubmission) return null;
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
      {canReadAll && (
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

      {showEditor && (
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
