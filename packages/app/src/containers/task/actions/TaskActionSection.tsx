import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { Divider, Typography } from "antd";
import React, { FC, ReactElement } from "react";
import { useProject } from "../../project/hooks";
import { ApplyToTaskAvatar } from "./apply/ApplyToTaskAvatar";
import { ApplyToTaskButton } from "./apply/ApplyToTaskButton";
import { ClaimTaskAvatar } from "./claim/ClaimTaskAvatar";
import { ClaimTaskButton } from "./claim/ClaimTaskButton";
import { CreateSubmissionAvatar } from "./submit/CreateSubmissionAvatar";
import { CreateSubmissionButton } from "./submit/CreateSubmissionButton";

interface Props {
  task: Task;
}

const TaskActionSectionContent: FC<{
  avatar: ReactElement;
  label: string;
  color?: string;
  button: ReactElement;
}> = ({ avatar, label, color, button }) => (
  <>
    <Typography.Paragraph
      strong
      className={`ant-typography-caption mx-auto ${
        !!color ? `text-color-${color}` : ""
      }`}
      style={{ textTransform: "uppercase", textAlign: "center" }}
    >
      {avatar}
      {label}
    </Typography.Paragraph>
    {button}
  </>
);

export const TaskActionSection: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const { project } = useProject(task.projectId);
  const canManageProject = usePermission("update", project);
  const canAssignTask = usePermission("update", task, "assigneeIds");
  const canSubmit = usePermission("submit", task);
  const canApply = usePermission("create", "TaskApplication");

  if (task.status !== TaskStatus.TODO) return null;

  const content = (() => {
    if (canManageProject) return null;
    if (!!user && task.assignees.some((a) => a.id === user.id)) {
      return (
        <CreateSubmissionButton size="large" type="primary" block task={task} />
      );
    }

    if (canSubmit && !!task.options?.allowOpenSubmission) {
      return (
        <TaskActionSectionContent
          color="yellow"
          avatar={
            <CreateSubmissionAvatar
              size={16}
              style={{ marginRight: 8, display: "inline-grid" }}
            />
          }
          label="Contest Bounty"
          button={
            <CreateSubmissionButton
              size="large"
              type="primary"
              block
              task={task}
            />
          }
        />
      );
    }

    if (canAssignTask && !task.assignees.length) {
      return (
        <TaskActionSectionContent
          avatar={
            <ClaimTaskAvatar
              size={16}
              style={{ marginRight: 8, display: "inline-grid" }}
            />
          }
          label="Direct Claiming"
          button={
            <ClaimTaskButton size="large" type="primary" block task={task} />
          }
        />
      );
    }

    if (!canAssignTask && canApply && !task.assignees.length) {
      return (
        <TaskActionSectionContent
          color="blue"
          avatar={
            <ApplyToTaskAvatar
              size={16}
              style={{ marginRight: 8, display: "inline-grid" }}
            />
          }
          label="Application Process"
          button={
            <ApplyToTaskButton size="large" type="primary" block task={task} />
          }
        />
      );
    }
  })();

  if (!content) return null;
  return (
    <div style={{ marginTop: 16 }}>
      {content}
      <Divider />
    </div>
  );
};
