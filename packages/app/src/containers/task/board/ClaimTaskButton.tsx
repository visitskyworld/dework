import React, { FC, useCallback, useMemo } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Task } from "@dewo/app/graphql/types";
import { Button, Space, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { useDeleteTaskApplication } from "../hooks";
import { useNavigateToTaskApplicationFn } from "@dewo/app/util/navigation";
import { LoginButton } from "../../auth/LoginButton";

interface Props {
  task: Task;
}

export const ClaimTaskButton: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const hasClaimedTask = useMemo(
    () => !!user && task.applications.some((tA) => tA.user.id === user.id),
    [user, task.applications]
  );

  const navigateToTasApplicationk = useNavigateToTaskApplicationFn();
  const handleInterested = useCallback(
    () => navigateToTasApplicationk(task.id),
    [navigateToTasApplicationk, task.id]
  );

  const deleteTaskApplication = useDeleteTaskApplication();
  const handleUnclaimTask = useCallback(
    () => deleteTaskApplication({ taskId: task.id, userId: user!.id }),
    [deleteTaskApplication, task.id, user]
  );

  if (!user) {
    return (
      <LoginButton size="small" type="text" icon={<Icons.UnlockOutlined />}>
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
          <Button size="small" disabled icon={<Icons.LockOutlined />}>
            Requested
          </Button>
        </Tooltip>
      ) : (
        <Button
          size="small"
          type="text"
          icon={<Icons.UnlockOutlined />}
          onClick={handleInterested}
        >
          Apply to task
        </Button>
      )}
    </>
  );
};
