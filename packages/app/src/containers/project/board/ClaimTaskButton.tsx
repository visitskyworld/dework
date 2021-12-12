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
  const handleClaimTask = useCallback(async () => {
    await claimTask(task);
    showClaimEducation.onToggleOff();
  }, [claimTask, task, showClaimEducation]);

  const showClaimConfirmation = useCallback(
    (event) => {
      eatClick(event);
      showClaimEducation.onToggleOn();
    },
    [showClaimEducation]
  );

  const hideClaimConfirmation = useCallback(
    (event) => {
      eatClick(event);
      showClaimEducation.onToggleOff();
    },
    [showClaimEducation]
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
          onClick={showClaimConfirmation}
        >
          Claim
        </Button>
      )}
      <Modal
        visible={showClaimEducation.value}
        okText="Claim Task"
        onOk={handleClaimTask}
        onCancel={hideClaimConfirmation}
      >
        Education on wth just happened
      </Modal>
    </>
  );
};
