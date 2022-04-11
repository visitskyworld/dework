import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import {
  TaskGatingType,
  TaskReward,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Table, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { SortOrder } from "antd/lib/table/interface";
import moment from "moment";
import Link from "next/link";
import React, { FC } from "react";
import { ApplyToTaskButton } from "../task/actions/apply/ApplyToTaskButton";
import { CreateSubmissionButton } from "../task/actions/submit/CreateSubmissionButton";
import { TaskTagsRow } from "../task/board/TaskTagsRow";
import {
  calculateTaskRewardAsUSD,
  formatTaskReward,
  formatTaskRewardAsUSD,
} from "../task/hooks";

interface Props {
  tasks: TaskWithOrganization[];
}

export const TaskDiscoveryTable: FC<Props> = ({ tasks }) => {
  const navigateToTask = useNavigateToTaskFn();
  const screens = useBreakpoint();

  return (
    <Table<TaskWithOrganization>
      dataSource={tasks}
      pagination={{ hideOnSinglePage: true }}
      size="small"
      showHeader={false}
      tableLayout="fixed"
      rowClassName="hover:cursor-pointer"
      className="dewo-discovery-table"
      rowKey="id"
      onRow={(t) => ({
        onClick: (e) => navigateToTask(t.id, e.metaKey),
      })}
      columns={[
        {
          key: "organization",
          width: 64 + 8 * 2,
          render: (_: unknown, task: TaskWithOrganization) => (
            <Link href={task.project.organization.permalink}>
              <a onClick={stopPropagation}>
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
                <>
                  <Typography.Paragraph
                    style={{
                      whiteSpace: "nowrap",
                      marginBottom: 0,
                      marginTop: 8,
                    }}
                  >
                    {formatTaskReward(task.reward)}
                  </Typography.Paragraph>
                  {!!task.reward.token.usdPrice && !task.reward.peggedToUsd && (
                    <Typography.Paragraph
                      type="secondary"
                      className="ant-typography-caption"
                    >
                      {formatTaskRewardAsUSD(task.reward)}
                    </Typography.Paragraph>
                  )}
                </>
              )}
              {!screens.sm && (
                <div onClick={stopPropagation}>
                  {task.gating === TaskGatingType.OPEN_SUBMISSION ? (
                    <CreateSubmissionButton
                      task={task}
                      size="small"
                      type="text"
                    />
                  ) : (
                    <ApplyToTaskButton task={task} size="small" type="text" />
                  )}
                </div>
              )}
            </>
          ),
        },
        ...(screens.sm
          ? [
              {
                title: "Reward",
                dataIndex: "reward",
                width: 120,
                render: (reward: TaskReward) =>
                  screens.sm &&
                  !!reward && (
                    <>
                      <Typography.Paragraph
                        style={{
                          whiteSpace: "nowrap",
                          marginBottom: 0,
                          textAlign: "center",
                        }}
                      >
                        {formatTaskReward(reward)}
                      </Typography.Paragraph>
                      {!!reward.token.usdPrice && !reward.peggedToUsd && (
                        <Typography.Paragraph
                          type="secondary"
                          className="ant-typography-caption"
                          style={{ textAlign: "center" }}
                        >
                          {formatTaskRewardAsUSD(reward)}
                        </Typography.Paragraph>
                      )}
                    </>
                  ),
                sorter: (a: TaskWithOrganization, b: TaskWithOrganization) =>
                  (calculateTaskRewardAsUSD(a.reward ?? undefined) ?? 0) -
                  (calculateTaskRewardAsUSD(b.reward ?? undefined) ?? 0),
                sortDirections: ["descend"] as SortOrder[],
              },
              {
                key: "actions",
                width: 150,
                render: (_: unknown, task: TaskWithOrganization) =>
                  screens.sm && (
                    <div onClick={stopPropagation}>
                      {task.gating === TaskGatingType.OPEN_SUBMISSION ? (
                        <CreateSubmissionButton
                          task={task}
                          size="small"
                          type="text"
                        />
                      ) : (
                        <ApplyToTaskButton
                          task={task}
                          size="small"
                          type="text"
                        />
                      )}
                    </div>
                  ),
              },
            ]
          : []),
      ]}
    />
  );
};
