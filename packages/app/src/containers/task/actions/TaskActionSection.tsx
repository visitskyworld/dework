import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  TaskDetails,
  TaskGatingType,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { Divider, Row, Space, Typography } from "antd";
import React, { FC, ReactElement, useMemo } from "react";
import { PayButton } from "../board/PayButton";
import { useShouldShowInlinePayButton } from "../board/util";
import { ApplyToTaskButton } from "./apply/ApplyToTaskButton";
import { ClaimTaskButton } from "./claim/ClaimTaskButton";
import { CreateSubmissionButton } from "./submit/CreateSubmissionButton";
import * as Icons from "@ant-design/icons";
import { ContestIcon } from "@dewo/app/components/icons/task/Contest";
import { ClaimableIcon } from "@dewo/app/components/icons/task/Claimable";
import { ApplicationIcon } from "@dewo/app/components/icons/task/Application";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";
import { deworkSocialLinks } from "@dewo/app/util/constants";
import { useTask } from "../hooks";
import { OpenDiscordButton } from "@dewo/app/components/OpenDiscordButton";

interface Props {
  task: TaskDetails;
}

const TaskActionSectionContent: FC<{
  icon: ReactElement;
  label: string;
  description?: string;
  color?: string;
  button: ReactElement;
}> = ({ icon, label, color, description, button }) => (
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
    {!!description && (
      <Typography.Paragraph
        type="secondary"
        className="ant-typography-caption"
        style={{ textAlign: "center", marginTop: 8 }}
      >
        {description}
        <QuestionmarkTooltip
          name="What other contributors see might differ"
          marginLeft={8}
          title="What other contributors see might differ."
          readMoreUrl={deworkSocialLinks.gitbook.bountyTypesAndGating}
        />
      </Typography.Paragraph>
    )}
  </>
);

export const TaskActionSection: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const canAssignTask = usePermission("update", task, "assigneeIds");
  const canSubmit = usePermission("submit", task);
  const shouldShowInlinePayButton = useShouldShowInlinePayButton(task);
  const taskDetails = useTask(task.id)?.task;
  const myApplication = useMemo(
    () => user && taskDetails?.applications.find((ta) => ta.userId === user.id),
    [user, taskDetails?.applications]
  );

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
      task.gating === TaskGatingType.ROLES &&
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

    if (task.status === TaskStatus.TODO && !task.assignees.length) {
      return (
        <TaskActionSectionContent
          icon={<ApplicationIcon style={{ width: 16 }} />}
          label="Application Process"
          description={
            canAssignTask
              ? "You can claim this task because you have the permission to manage it"
              : undefined
          }
          button={
            canAssignTask ? (
              <ClaimTaskButton size="large" type="primary" block task={task} />
            ) : (
              <Space direction="vertical" style={{ width: "100%" }}>
                <ApplyToTaskButton
                  size="large"
                  type="primary"
                  block
                  task={task}
                />

                {myApplication?.discordThreadUrl && (
                  <OpenDiscordButton
                    block
                    type="primary"
                    href={myApplication.discordThreadUrl}
                  >
                    Discuss with reviewer
                  </OpenDiscordButton>
                )}
              </Space>
            )
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
