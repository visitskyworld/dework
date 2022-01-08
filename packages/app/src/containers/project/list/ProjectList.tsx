import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { Task, User } from "@dewo/app/graphql/types";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Avatar, Table } from "antd";
import Link from "next/link";
import React, { FC } from "react";
import { TaskTagsRow } from "../board/TaskTagsRow";
import { useProjectTasks } from "../hooks";

interface Props {
  projectId: string;
}

export const ProjectList: FC<Props> = ({ projectId }) => {
  const tasks = useProjectTasks(projectId, "cache-and-network")?.tasks;
  const navigateToTask = useNavigateToTaskFn();
  return (
    <Table<Task>
      dataSource={tasks}
      size="small"
      showHeader={false}
      style={{ marginLeft: 24, marginRight: 24 }}
      rowClassName="hover:cursor-pointer"
      pagination={{ hideOnSinglePage: true }}
      onRow={(t) => ({ onClick: () => navigateToTask(t.id) })}
      columns={[
        { title: "Name", dataIndex: "name" },
        {
          // title: "Tags",
          dataIndex: "tags",
          width: 240,
          render: (_, task) => (
            <TaskTagsRow task={task} style={{ justifyContent: "flex-end" }} />
          ),
        },
        {
          // title: "Assignee(s)",
          dataIndex: "assignees",
          width: 1,
          render: (assignees: User[]) => (
            <Avatar.Group maxCount={3} size={22}>
              {assignees.map((user) => (
                <Link href={`/profile/${user.id}`} key={user.id}>
                  <a>
                    <UserAvatar user={user} />
                  </a>
                </Link>
              ))}
            </Avatar.Group>
          ),
        },
      ]}
    />
  );
};
