import React, { FC } from "react";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import Link from "next/link";
import { Avatar } from "antd";
import { CreateSubmissionAvatar } from "../actions/submit/CreateSubmissionAvatar";
import { ApplyToTaskAvatar } from "../actions/apply/ApplyToTaskAvatar";
import { ClaimTaskAvatar } from "../actions/claim/ClaimTaskAvatar";

interface Props {
  task: Task;
}

export const TaskCardAvatars: FC<Props> = ({ task }) => {
  const canUpdateTask = usePermission("update", task);

  if (!!task.assignees.length) {
    return (
      <Avatar.Group maxCount={task.assignees.length === 3 ? 3 : 2} size={20}>
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
        <Avatar.Group maxCount={task.assignees.length === 3 ? 3 : 2} size={20}>
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
      return <CreateSubmissionAvatar size={20} />;
    }

    if (canUpdateTask) {
      return <ClaimTaskAvatar size={20} />;
    }

    return <ApplyToTaskAvatar size={20} />;
  }

  return null;
};
