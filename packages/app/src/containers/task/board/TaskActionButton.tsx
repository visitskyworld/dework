import React, { FC, useCallback } from "react";
import {
  Task,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import { useNavigateToTask } from "@dewo/app/util/navigation";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ClaimTaskButton } from "./ClaimTaskButton";
import { useUpdateTask } from "../hooks";
import { PayButton } from "./PayButton";
import { useShouldShowInlinePayButton } from "./util";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { CreateSubmissionButton } from "./CreateSubmissionButton";
import { stopPropagation } from "@dewo/app/util/eatClick";

interface TaskCardProps {
  task: Task | TaskWithOrganization;
}

export const TaskActionButton: FC<TaskCardProps> = ({ task }) => {
  const navigateToTask = useNavigateToTask(task.id);
  const currentUserId = useAuthContext().user?.id;

  const updateTask = useUpdateTask();
  const moveToDone = useCallback(
    () => updateTask({ id: task.id, status: TaskStatus.DONE }, task),
    [updateTask, task]
  );

  const shouldShowInlinePayButton = useShouldShowInlinePayButton(task);
  const canManage = usePermission("update", task);
  const canApply = usePermission("create", "TaskApplication");
  const canUpdateTask = usePermission("update", task, "status");
  const canAssignTask = usePermission("update", task, "assigneeIds");
  const canCreateSubmission = usePermission("submit", task);

  const button = (() => {
    if (shouldShowInlinePayButton) {
      return <PayButton task={task}>Pay</PayButton>;
    }

    if (
      task.status === TaskStatus.IN_REVIEW &&
      !!task.reward &&
      !task.reward.payment &&
      !!currentUserId &&
      task.ownerId === currentUserId
    ) {
      return (
        <Button size="small" onClick={moveToDone}>
          Approve
        </Button>
      );
    }

    if (
      [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW].includes(
        task.status
      ) &&
      canUpdateTask &&
      !!task.submissions.length
    ) {
      return (
        <Button
          size="small"
          type="primary"
          icon={<Icons.EditOutlined />}
          onClick={navigateToTask}
        >
          Review
        </Button>
      );
    }

    if (
      task.status === TaskStatus.TODO &&
      canAssignTask &&
      !!task.applications.length
    ) {
      return (
        <Button
          size="small"
          type="primary"
          icon={<Icons.LockOutlined />}
          onClick={navigateToTask}
        >
          Pick Contributor
        </Button>
      );
    }

    if (
      [TaskStatus.TODO, TaskStatus.IN_PROGRESS].includes(task.status) &&
      !!task.options?.allowOpenSubmission &&
      canCreateSubmission
    ) {
      return <CreateSubmissionButton task={task} />;
    }

    if (!canManage && task.status === TaskStatus.TODO && canApply) {
      return <ClaimTaskButton task={task} />;
    }
  })();

  if (!button) return null;
  return (
    <div onClick={stopPropagation} style={{ display: "inline-block" }}>
      {button}
    </div>
  );
};
