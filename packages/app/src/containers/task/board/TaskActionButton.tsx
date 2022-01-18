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
import { LoginButton } from "../../auth/LoginButton";
import { CreateSubmissionButton } from "./CreateSubmissionButton";

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
  const canClaimTask = usePermission("claimTask", task);
  const canUpdateTask = usePermission("update", task, "_");
  const canCreateSubmission = usePermission("update", task, "submissions");

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

  if (task.status === TaskStatus.TODO) {
    if (canUpdateTask) {
      console.log(task);
      if (!!task.submissions.length) {
        return (
          <Button
            size="small"
            type="primary"
            icon={<Icons.LockOutlined />}
            onClick={navigateToTask}
          >
            Choose Submission
          </Button>
        );
      } else if (!!task.applications.length) {
        return (
          <Button
            size="small"
            type="primary"
            icon={<Icons.LockOutlined />}
            onClick={navigateToTask}
          >
            Choose Contributor
          </Button>
        );
      }
    } else if (canCreateSubmission) {
      if (!!currentUserId) {
        return <CreateSubmissionButton task={task} />;
      } else {
        return (
          <LoginButton size="small" icon={<Icons.UnlockOutlined />}>
            Create Submission
          </LoginButton>
        );
      }
    } else if (canClaimTask) {
      if (!!currentUserId) {
        return <ClaimTaskButton task={task} />;
      } else {
        return (
          <LoginButton size="small" icon={<Icons.UnlockOutlined />}>
            I'm Interested
          </LoginButton>
        );
      }
    }
  }

  return null;
};
