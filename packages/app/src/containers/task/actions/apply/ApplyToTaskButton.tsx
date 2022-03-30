import React, { FC, useCallback, useMemo } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Button, ButtonProps, Space, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { useNavigateToTaskApplicationFn } from "@dewo/app/util/navigation";
import { LoginButton } from "@dewo/app/containers/auth/LoginButton";
import { useDeleteTaskApplication } from "../../hooks";
import { Task } from "@dewo/app/graphql/types";

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

  if (!user) {
    return (
      <LoginButton
        {...buttonProps}
        icon={<Icons.UnlockOutlined />}
        onAuthedWithWallet={handleInterested}
      >
        Apply to task
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
          icon={<Icons.UnlockOutlined />}
          onClick={handleInterested}
        >
          Apply to task
        </Button>
      )}
    </>
  );
};
