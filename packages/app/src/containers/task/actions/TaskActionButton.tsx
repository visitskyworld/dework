import React, { FC, ReactElement, useCallback } from "react";
import {
  PaymentStatus,
  Task,
  TaskGatingType,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import { useNavigateToTask } from "@dewo/app/util/navigation";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ApplyToTaskButton } from "../actions/apply/ApplyToTaskButton";
import { useUpdateTask } from "../hooks";
import { PayButton } from "../board/PayButton";
import { useShouldShowInlinePayButton } from "../board/util";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { CreateSubmissionButton } from "./submit/CreateSubmissionButton";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { ClaimTaskButton } from "./claim/ClaimTaskButton";
import { ClearTaskRewardPaymentButton } from "../board/ClearTaskRewardPaymentButton";

interface TaskCardProps {
  task: Task | TaskWithOrganization;
}

export function useTaskActionButton(task: Task): ReactElement | undefined {
  const { user } = useAuthContext();
  const navigateToTask = useNavigateToTask(task.id);
  const currentUserId = useAuthContext().user?.id;

  const updateTask = useUpdateTask();
  const moveToDone = useCallback(
    () => updateTask({ id: task.id, status: TaskStatus.DONE }, task),
    [updateTask, task]
  );

  const shouldShowInlinePayButton = useShouldShowInlinePayButton(task);
  const canManage = usePermission("update", task, "ownerIds");
  const canApply = usePermission("create", "TaskApplication");
  const canAssignTask = usePermission("update", task, "assigneeIds");
  const canSubmit = usePermission("submit", task);
  const canUpdate = usePermission("update", "TaskReward");

  const shouldShowClearButton =
    canUpdate && task.reward?.payment?.status === PaymentStatus.FAILED;

  if (shouldShowClearButton && task.reward?.payment) {
    return (
      <ClearTaskRewardPaymentButton payment={task.reward.payment}>
        Clear
      </ClearTaskRewardPaymentButton>
    );
  }

  if (shouldShowInlinePayButton) {
    return <PayButton task={task}>Pay</PayButton>;
  }

  if (
    task.status === TaskStatus.IN_REVIEW &&
    !!task.reward &&
    !task.reward.payment &&
    !!currentUserId &&
    task.owners.some((u) => u.id === currentUserId)
  ) {
    return (
      <Button
        icon={<Icons.CheckOutlined />}
        size="small"
        type="text"
        onClick={moveToDone}
      >
        Approve
      </Button>
    );
  }

  if (
    [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW].includes(
      task.status
    ) &&
    canManage &&
    !!task.submissions.length
  ) {
    return (
      <Button
        size="small"
        type="primary"
        icon={<Icons.EditOutlined />}
        onClick={navigateToTask}
      >
        {task.submissions.length === 1
          ? "1 Submission"
          : `${task.submissions.length} Submissions`}
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
        {task.applications.length === 1
          ? "1 Applicant"
          : `${task.applications.length} Applicants`}
      </Button>
    );
  }

  if (
    [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW].includes(
      task.status
    ) &&
    !!user &&
    task.assignees.some((a) => a.id === user.id)
  ) {
    return <CreateSubmissionButton task={task} size="small" type="text" />;
  }

  if (
    [TaskStatus.TODO, TaskStatus.IN_PROGRESS].includes(task.status) &&
    task.gating === TaskGatingType.OPEN_SUBMISSION &&
    canSubmit
  ) {
    return <CreateSubmissionButton task={task} size="small" type="text" />;
  }

  if (
    canAssignTask &&
    task.status === TaskStatus.TODO &&
    !task.assignees.length
  ) {
    return <ClaimTaskButton task={task} size="small" type="text" />;
  }

  if (
    !canManage &&
    task.status === TaskStatus.TODO &&
    canApply &&
    !task.assignees.length
  ) {
    return <ApplyToTaskButton task={task} size="small" type="text" />;
  }
}

export const TaskActionButton: FC<TaskCardProps> = ({ task }) => {
  const button = useTaskActionButton(task);
  if (!button) return null;
  return (
    <div onClick={stopPropagation} style={{ display: "inline-block" }}>
      {button}
    </div>
  );
};
