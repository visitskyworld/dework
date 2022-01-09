import * as Icons from "@ant-design/icons";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { Task, TaskStatus, User } from "@dewo/app/graphql/types";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Avatar, Table, Tag, Typography } from "antd";
import React, { FC } from "react";
import { TaskActionButton } from "../board/TaskActionButton";
import { TaskTagsRow } from "../board/TaskTagsRow";
import { STATUS_LABEL } from "../board/util";
import { useProjectTasks, useProjectTaskTags } from "../hooks";

interface Props {
  projectId: string;
}

const statuses = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

export const ProjectTaskList: FC<Props> = ({ projectId }) => {
  const tags = useProjectTaskTags(projectId);
  const tasks = useProjectTasks(projectId, "cache-and-network")?.tasks;
  const navigateToTask = useNavigateToTaskFn();
  return (
    <Table<Task>
      dataSource={tasks}
      // size="small"
      // showHeader={false}
      style={{ marginLeft: 24, marginRight: 24 }}
      rowClassName="hover:cursor-pointer"
      pagination={{ hideOnSinglePage: true }}
      onRow={(t) => ({ onClick: () => navigateToTask(t.id) })}
      columns={[
        {
          // title: "Assignee(s)",
          dataIndex: "assignees",
          width: 1,
          render: (assignees: User[]) => (
            <Avatar.Group maxCount={3}>
              {assignees.map((user) => (
                <UserAvatar key={user.id} user={user} />
              ))}
              {!assignees.length && <Avatar icon={<Icons.UserAddOutlined />} />}
            </Avatar.Group>
          ),
        },
        {
          title: "Name",
          dataIndex: "name",
          showSorterTooltip: false,
          sorter: (a: Task, b: Task) => a.name.localeCompare(b.name),
          render: (name: string) => (
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {name}
            </Typography.Title>
          ),
        },
        {
          title: "Status",
          dataIndex: "status",
          width: 120,
          filters: statuses.map((status) => ({
            value: status,
            text: STATUS_LABEL[status],
          })),
          onFilter: (status, task) => task.status === status,
          render: (status: TaskStatus) => STATUS_LABEL[status],
          defaultSortOrder: "ascend",
          sorter: (a: Task, b: Task) =>
            statuses.indexOf(a.status) - statuses.indexOf(b.status),
          showSorterTooltip: false,
        },
        {
          title: "Tags",
          dataIndex: "tags",
          width: 240,
          filters: tags.map((tag) => ({
            value: tag.id,
            text: <Tag color={tag.color}>{tag.label}</Tag>,
          })),
          onFilter: (tagId, task) => task.tags.some((t) => t.id === tagId),
          render: (_, task) => (
            <TaskTagsRow task={task} style={{ justifyContent: "flex-end" }} />
          ),
        },
        {
          key: "button",
          width: 1,
          render: (_, task) => <TaskActionButton task={task} />,
        },
      ]}
    />
  );
};
