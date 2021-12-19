import React, { FC, useCallback, useMemo } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Task } from "@dewo/app/graphql/types";
import { Button, Space, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { useUnclaimTask } from "../../task/hooks";
import { eatClick } from "@dewo/app/util/eatClick";
import { useToggle } from "@dewo/app/util/hooks";
import { TaskApplyModal } from "../../task/TaskApplyModal";

interface Props {
  task: Task;
}

export const ClaimTaskButton: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const hasClaimedTask = useMemo(
    () => !!user && task.taskApplications.some((tA) => tA.user.id === user.id),
    [user, task.assignees]
  );

  const showClaimEducation = useToggle();

  const unclaimTask = useUnclaimTask();
  const handleClaimTask = useCallback(
    (event) => {
      eatClick(event);
      showClaimEducation.toggleOn();
    },
    [showClaimEducation]
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
      <TaskApplyModal
        task={task}
        visible={showClaimEducation.isOn}
        onCancel={hideClaimConfirmation}
        onDone={showClaimEducation.toggleOff}
      />
    </>
  );
};
