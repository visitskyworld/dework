import React, { FC } from "react";
import { Task, TaskGatingType, TaskStatus } from "@dewo/app/graphql/types";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ClaimableIcon } from "@dewo/app/components/icons/task/Claimable";
import { ApplicationIcon } from "@dewo/app/components/icons/task/Application";
import { ContestIcon } from "@dewo/app/components/icons/task/Contest";
import { LockIcon } from "@dewo/app/components/icons/task/Lock";
import { Tooltip } from "antd";

interface Props {
  task: Task;
}

export const TaskGatingIcon: FC<Props> = ({ task }) => {
  const canUpdateTask = usePermission("update", task);

  if (task.status === TaskStatus.TODO) {
    if (!!task.assignees.length) {
      return (
        <Tooltip title="This task is already assigned to someone">
          <LockIcon style={{ width: 16 }} />
        </Tooltip>
      );
    }

    if (task.gating === TaskGatingType.OPEN_SUBMISSION) {
      return (
        <Tooltip title="Anyone can do this task and submit work. One or more get chosen as winners">
          <ContestIcon style={{ width: 16 }} />
        </Tooltip>
      );
    }

    if (canUpdateTask) {
      return (
        <Tooltip title="Claim this task to assign yourself and start working on it">
          <ClaimableIcon style={{ width: 16 }} />
        </Tooltip>
      );
    }

    return (
      <Tooltip title="Apply to this task, and the task reviewer can assign it to you">
        <ApplicationIcon style={{ width: 16 }} />
      </Tooltip>
    );
  }

  return null;
};
