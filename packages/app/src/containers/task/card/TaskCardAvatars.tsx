import React, { FC } from "react";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import Link from "next/link";
import { Avatar } from "antd";
import { TaskOpenSubmissionAvatar } from "./TaskOpenSubmissionAvatar";
import { TaskApplyAvatar } from "./TaskApplyAvatar";

interface Props {
  task: Task;
}

export const TaskCardAvatars: FC<Props> = ({ task }) => {
  const canUpdateTask = usePermission("update", task);

  if (!!task.assignees.length) {
    return (
      <Avatar.Group maxCount={task.assignees.length === 3 ? 3 : 2} size={22}>
        {task.assignees.map((user) => (
          <Link href={user.permalink} key={user.id}>
            <a>
              <UserAvatar user={user} />
            </a>
          </Link>
        ))}
      </Avatar.Group>
    );
  }

  if (task.status === TaskStatus.TODO) {
    if (!!task.applications.length && canUpdateTask) {
      return (
        <Avatar.Group maxCount={task.assignees.length === 3 ? 3 : 2} size={22}>
          {task.applications.map((application) => (
            <Link href={application.user.permalink} key={application.id}>
              <a>
                <UserAvatar user={application.user} />
              </a>
            </Link>
          ))}
        </Avatar.Group>
      );
    }

    if (task.options?.allowOpenSubmission) {
      return <TaskOpenSubmissionAvatar />;
    }

    if (canUpdateTask) {
      return <Avatar size={22} className="ant-avatar-white" />;
    }

    return <TaskApplyAvatar />;
  }

  return null;
};
