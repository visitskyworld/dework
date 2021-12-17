import React, { FC, useCallback, useMemo } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Task } from "@dewo/app/graphql/types";
import { Button, Modal, Space, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { useClaimTask, useUnclaimTask } from "../../task/hooks";
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
  const unclaimTask = useUnclaimTask();
  const handleClaimTask = useCallback(
    async (event) => {
      eatClick(event);
      await claimTask(task);
      showClaimEducation.toggleOn();
    },
    [claimTask, task, showClaimEducation]
  );
  const handleUnclaimTask = useCallback(
    async (event) => {
      eatClick(event);
      unclaimTask(task);
    },
    [unclaimTask, task]
  );
  const hideClaimConfirmation = useCallback(
    (event) => {
      eatClick(event);
      showClaimEducation.toggleOff();
    },
    [showClaimEducation]
  );

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
          icon={<Icons.UnlockOutlined />}
          onClick={handleClaimTask}
        >
          Apply
        </Button>
      )}
      <Modal
        visible={showClaimEducation.isOn}
        okText="Sounds good!"
        onOk={hideClaimConfirmation}
        onCancel={hideClaimConfirmation}
      >
        Congratulations - you've just applied to claim the task!
        <br />
        <br />
        You will recieve a Discord notification if you get choosen for the task.
      </Modal>
    </>
  );
};
