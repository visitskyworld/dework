import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task, TaskGatingType, TaskStatus } from "@dewo/app/graphql/types";
import { Divider, Row, Typography } from "antd";
import React, { FC, ReactElement } from "react";
import { useProject } from "../../project/hooks";
import { PayButton } from "../board/PayButton";
import { useShouldShowInlinePayButton } from "../board/util";
import { ApplyToTaskButton } from "./apply/ApplyToTaskButton";
import { ClaimTaskButton } from "./claim/ClaimTaskButton";
import { CreateSubmissionButton } from "./submit/CreateSubmissionButton";
import * as Icons from "@ant-design/icons";
import { ContestIcon } from "@dewo/app/components/icons/task/Contest";
import { ClaimableIcon } from "@dewo/app/components/icons/task/Claimable";
import { ApplicationIcon } from "@dewo/app/components/icons/task/Application";

interface Props {
  task: Task;
}

const TaskActionSectionContent: FC<{
  icon: ReactElement;
  label: string;
  color?: string;
  button: ReactElement;
}> = ({ icon, label, color, button }) => (
  <>
    <Row
      align="middle"
      justify="center"
      style={{ marginBottom: 8, columnGap: 8 }}
    >
      {icon}
      <Typography.Text
        strong
        className={`ant-typography-caption ${
          !!color ? `text-color-${color}` : ""
        }`}
        style={{ textTransform: "uppercase" }}
      >
        {label}
      </Typography.Text>
    </Row>
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
  const shouldShowInlinePayButton = useShouldShowInlinePayButton(task);

  const content = (() => {
    if (shouldShowInlinePayButton) {
      return (
        <PayButton
          block
          size="large"
          icon={<Icons.DollarCircleOutlined />}
          task={task}
        >
          Pay
        </PayButton>
      );
    }
    if (
      [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW].includes(
        task.status
      ) &&
      !!user &&
      task.assignees.some((a) => a.id === user.id)
    ) {
      return (
        <CreateSubmissionButton size="large" type="primary" block task={task} />
      );
    }

    if (
      [TaskStatus.TODO, TaskStatus.IN_PROGRESS].includes(task.status) &&
      canSubmit &&
      task.gating === TaskGatingType.OPEN_SUBMISSION
    ) {
      return (
        <TaskActionSectionContent
          color="yellow"
          icon={<ContestIcon style={{ width: 16 }} />}
          label="Multiple Submissions"
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

    if (
      task.status === TaskStatus.TODO &&
      canAssignTask &&
      !task.assignees.length
    ) {
      return (
        <TaskActionSectionContent
          icon={<ClaimableIcon style={{ width: 16 }} />}
          label="Direct Claiming"
          button={
            <ClaimTaskButton size="large" type="primary" block task={task} />
          }
        />
      );
    }

    if (
      task.status === TaskStatus.TODO &&
      !canManageProject &&
      !canAssignTask &&
      canApply &&
      !task.assignees.length
    ) {
      return (
        <TaskActionSectionContent
          color="blue"
          icon={<ApplicationIcon style={{ width: 16 }} />}
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
