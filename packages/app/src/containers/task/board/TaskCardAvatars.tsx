import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import Link from "next/link";
import { Avatar, Tooltip } from "antd";
import { PersonEditIcon } from "@dewo/app/components/icons/PersonEdit";

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

  if (
    task.status === TaskStatus.TODO &&
    !!task.applications.length &&
    canUpdateTask
  ) {
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

  if (task.status === TaskStatus.TODO && task.options?.allowOpenSubmission) {
    return (
      <Tooltip title="This is a contest bounty. Anyone can create a submission and the reviewer will pick the winner.">
        <Avatar
          size={22}
          icon={<Icons.TrophyFilled />}
          className="ant-avatar-yellow"
          style={{ display: "grid", placeItems: "center" }}
        />
      </Tooltip>
    );
  }

  if (task.status === TaskStatus.TODO) {
    return (
      <Tooltip title="Apply to this task, and the task reviewer can assign it to you">
        <Avatar
          size={22}
          icon={<PersonEditIcon />}
          className="ant-avatar-blue"
          style={{ display: "grid", placeItems: "center" }}
        />
      </Tooltip>
    );
  }

  return null;
};
