import React, { FC, useCallback, useMemo } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Task } from "@dewo/app/graphql/types";
import { Button, Modal } from "antd";
import * as Icons from "@ant-design/icons";
import { useClaimTask } from "../../task/hooks";
import { eatClick } from "@dewo/app/util/eatClick";
import { useToggle } from "@dewo/app/util/hooks";

interface Props {
  task: Task;
}

export const ClaimTaskButton: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const hasClaimedTask = useMemo(
    () => !!user && task.assignees.some((a) => a.id === user.id),
    [user, task.assignees]
  );

  const showClaimEducation = useToggle();

  const claimTask = useClaimTask();
  const handleClaimTask = useCallback(
    async (event) => {
      eatClick(event);
      await claimTask(task);
      showClaimEducation.onToggleOn();
    },
    [claimTask, task, showClaimEducation]
  );

  return (
    <>
      {hasClaimedTask ? (
        <Button size="small" disabled icon={<Icons.LockOutlined />}>
          Requested
        </Button>
      ) : (
        <Button
          size="small"
          icon={<Icons.UnlockOutlined />}
          onClick={handleClaimTask}
        >
          Claim
        </Button>
      )}
      <Modal
        visible={showClaimEducation.value}
        title="Project Settings"
        footer={null}
        onCancel={showClaimEducation.onToggleOff}
      >
        Education on wth just happened
      </Modal>
    </>
  );
};
