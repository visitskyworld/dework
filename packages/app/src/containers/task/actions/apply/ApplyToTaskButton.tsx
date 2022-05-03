import React, { FC, useCallback, useMemo } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Button, ButtonProps, Space, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { useNavigateToTaskApplicationFn } from "@dewo/app/util/navigation";
import { LoginButton } from "@dewo/app/containers/auth/buttons/LoginButton";
import { useDeleteTaskApplication } from "../../hooks";
import { Task } from "@dewo/app/graphql/types";
import {
  ExperimentOptions,
  useExperiment,
} from "@dewo/app/util/analytics/useExperiment";

const applyCtaExperiment: ExperimentOptions<"A" | "B"> = {
  name: "Task apply button copy",
  variants: {
    A: "Apply to task",
    B: "I'm interested",
  },
};

interface Props extends ButtonProps {
  task: Task;
}

export const ApplyToTaskButton: FC<Props> = ({ task, ...buttonProps }) => {
  const { user } = useAuthContext();
  const hasClaimedTask = useMemo(
    () => !!user && task.applications.some((ta) => ta.userId === user.id),
    [user, task.applications]
  );

  const navigateToTaskApplication = useNavigateToTaskApplicationFn();
  const handleInterested = useCallback(
    () => navigateToTaskApplication(task.id),
    [navigateToTaskApplication, task.id]
  );

  const deleteTaskApplication = useDeleteTaskApplication();
  const handleUnclaimTask = useCallback(
    () => deleteTaskApplication({ taskId: task.id, userId: user!.id }),
    [deleteTaskApplication, task.id, user]
  );

  const applyCtaVariant = useExperiment(applyCtaExperiment);
  const applyToTaskCopy = applyCtaExperiment.variants[applyCtaVariant];

  if (!user) {
    return (
      <LoginButton
        {...buttonProps}
        icon={<Icons.UnlockOutlined />}
        name="Apply to task (unauthenticated)"
        onAuthedWithWallet={handleInterested}
      >
        {applyToTaskCopy}
      </LoginButton>
    );
  }
  return (
    <>
      {hasClaimedTask ? (
        <Tooltip
          placement="bottom"
          title={
            <Space
              direction="vertical"
              size="small"
              style={{ alignItems: "center", maxWidth: 120 }}
            >
              <Typography.Text style={{ textAlign: "center" }}>
                You've applied to claim this task
              </Typography.Text>
              <Button
                size="small"
                name="Unclaim task"
                onClick={handleUnclaimTask}
                icon={<Icons.UnlockOutlined />}
              >
                Unclaim
              </Button>
            </Space>
          }
        >
          <Button {...buttonProps} disabled icon={<Icons.LockOutlined />}>
            Requested
          </Button>
        </Tooltip>
      ) : (
        <Button
          {...buttonProps}
          name="Apply to task"
          icon={<Icons.UnlockOutlined />}
          onClick={handleInterested}
        >
          {applyToTaskCopy}
        </Button>
      )}
    </>
  );
};
