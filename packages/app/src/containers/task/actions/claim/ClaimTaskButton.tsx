import React, { FC } from "react";
import { Task } from "@dewo/app/graphql/types";
import { Button, ButtonProps } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { useUpdateTask } from "../../hooks";

interface Props extends ButtonProps {
  task: Task;
}

export const ClaimTaskButton: FC<Props> = ({ task, ...buttonProps }) => {
  const currentUserId = useAuthContext().user?.id;
  const updateTask = useUpdateTask();
  const [claimTask, claimingTask] = useRunningCallback(
    () =>
      !!currentUserId &&
      updateTask({ id: task.id, assigneeIds: [currentUserId] }),
    [currentUserId, updateTask, task.id]
  );

  return (
    <Button
      {...buttonProps}
      loading={claimingTask}
      icon={<Icons.ArrowRightOutlined />}
      onClick={claimTask}
    >
      Claim task
    </Button>
  );
};
