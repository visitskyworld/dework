import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import {
  GetTasksInput,
  TaskReward,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Table, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
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

export const TaskDiscoveryList: FC = () => {
  const tasks = useTasks(tasksQuery);
  const navigateToTask = useNavigateToTaskFn();
  const screens = useBreakpoint();

  return (
    <Table<TaskWithOrganization>
      dataSource={tasks}
      showHeader={false}
      pagination={{ hideOnSinglePage: true }}
      size="small"
      style={{ paddingLeft: 8, paddingRight: 8 }}
      tableLayout={screens.sm ? "auto" : "fixed"}
      rowClassName="hover:cursor-pointer"
      className="mx-auto max-w-md w-full dewo-discovery-table"
      onRow={(t) => ({ onClick: () => navigateToTask(t.id) })}
      columns={[
        {
          key: "organization",
          width: 64 + 8 * 2,
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
              {!screens.sm && !!task.reward && (
                <Typography.Paragraph
                  style={{
                    whiteSpace: "nowrap",
                    marginBottom: 0,
                    marginTop: 8,
                  }}
                >
                  {formatTaskReward(task.reward)}
                </Typography.Paragraph>
              )}
              {!screens.sm && <TaskActionButton task={task} />}
            </>
          ),
        },
        ...(screens.sm
          ? [
              {
                title: "Reward",
                dataIndex: "reward",
                width: 1,
                render: (reward: TaskReward) =>
                  screens.sm &&
                  !!reward && (
                    <Typography.Paragraph
                      style={{ whiteSpace: "nowrap", marginBottom: 0 }}
                    >
                      {formatTaskReward(reward)}
                    </Typography.Paragraph>
                  ),
              },
              {
                key: "actions",
                width: 1,
                render: (_: unknown, task: TaskWithOrganization) =>
                  screens.sm && <TaskActionButton task={task} />,
              },
            ]
          : []),
      ]}
    />
  );
};