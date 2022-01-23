import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import {
  GetTasksInput,
  TaskReward,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Table, Typography } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { FC } from "react";
import { TaskActionButton } from "../task/board/TaskActionButton";
import { TaskTagsRow } from "../task/board/TaskTagsRow";
import { formatTaskReward, useTasks } from "../task/hooks";

const tasksQuery: GetTasksInput = {
  statuses: [TaskStatus.TODO],
  rewardNotNull: true,
  assigneeId: null,
};

interface Props {}

export const TaskDiscoveryList: FC<Props> = ({}) => {
  const tasks = useTasks(tasksQuery);
  const navigateToTask = useNavigateToTaskFn();

  return (
    <Table<TaskWithOrganization>
      dataSource={tasks}
      showHeader={false}
      pagination={{ hideOnSinglePage: true, pageSize: 4 }}
      size="small"
      rowClassName="hover:cursor-pointer"
      className="mx-auto max-w-md w-full dewo-discovery-table"
      onRow={(t) => ({ onClick: () => navigateToTask(t.id) })}
      columns={[
        {
          key: "organization",
          width: 1,
          render: (_: unknown, task: TaskWithOrganization) => (
            <Link href={task.project.organization.permalink}>
              <a>
                <OrganizationAvatar
                  organization={task.project.organization}
                  size={64}
                  tooltip={{ title: "View DAO profile" }}
                />
              </a>
            </Link>
          ),
        },
        {
          key: "overview",
          render: (_: unknown, task: TaskWithOrganization) => (
            <>
              <Typography.Paragraph
                strong
                ellipsis={{ rows: 1 }}
                style={{ margin: 0 }}
              >
                {task.name}
              </Typography.Paragraph>
              <Typography.Paragraph
                type="secondary"
                style={{ marginBottom: 8 }}
                className="ant-typography-caption"
              >
                Created by {task.project.organization.name} (
                {moment(task.createdAt).calendar()})
              </Typography.Paragraph>
              <TaskTagsRow task={task} showStandardTags={false} />
            </>
          ),
        },
        {
          title: "Reward",
          dataIndex: "reward",
          width: 1,
          render: (reward: TaskReward) =>
            !!reward && (
              <>
                <Typography.Paragraph
                  style={{ whiteSpace: "nowrap", marginBottom: 0 }}
                >
                  {formatTaskReward(reward)}
                </Typography.Paragraph>
                {/* <Typography.Text
                  type="secondary"
                  className="ant-typography-caption"
                  style={{ whiteSpace: "nowrap" }}
                >
                  ~$123.3
                </Typography.Text> */}
              </>
            ),
        },
        {
          key: "actions",
          width: 1,
          render: (_, task: TaskWithOrganization) => (
            <TaskActionButton task={task} />
          ),
        },
      ]}
    />
  );
};
