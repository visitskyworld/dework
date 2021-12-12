import React, { FC, useCallback, useMemo } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Task } from "@dewo/app/graphql/types";
import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import { useClaimTask } from "../../task/hooks";
import { eatClick } from "@dewo/app/util/eatClick";

interface Props {
  task: Task;
}

export const ClaimTaskButton: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const hasClaimedTask = useMemo(
    () => !!user && task.assignees.some((a) => a.id === user.id),
    [user, task.assignees]
  );

  const claimTask = useClaimTask();
  const handleClaimTask = useCallback(
    async (event) => {
      eatClick(event);
      claimTask(task);
    },
    [claimTask, task]
  );

  if (hasClaimedTask) {
    return (
      <Button size="small" disabled icon={<Icons.LockOutlined />}>
        Requested
      </Button>
    );
  }

  return (
    <Button
      size="small"
      icon={<Icons.UnlockOutlined />}
      onClick={handleClaimTask}
    >
      Claim
    </Button>
  );
};
