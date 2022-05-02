import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import {
  TaskGatingType,
  TaskReward,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Skeleton, Table, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { SortOrder, TablePaginationConfig } from "antd/lib/table/interface";
import _ from "lodash";
import moment from "moment";
import Link from "next/link";
import React, { FC, useEffect, useMemo, useState } from "react";
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
  total: number;
  loading: boolean;
  onFetchMore(): void;
}

export const TaskDiscoveryTable: FC<Props> = ({
  tasks,
  total,
  loading,
  onFetchMore,
}) => {
  const navigateToTask = useNavigateToTaskFn();
  const screens = useBreakpoint();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const rows = useMemo(
    () => _.range(total).map((index) => tasks[index]),
    [tasks, total]
  );

  const isLastTaskLoaded = useMemo(() => {
    if (!pagination?.current || !pagination?.pageSize) return true;
    const lastTaskIndex = pagination.current * pagination.pageSize - 1;
    return !!tasks[lastTaskIndex];
  }, [pagination, tasks]);
  useEffect(() => {
    if (!loading && !isLastTaskLoaded) {
      onFetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isLastTaskLoaded]);

  return (
    <Table
      dataSource={rows}
      pagination={{ hideOnSinglePage: true }}
      size="small"
      showHeader={false}
      tableLayout="fixed"
      rowClassName="hover:cursor-pointer"
      className="dewo-discovery-table"
      rowKey="id"
      onChange={setPagination}
      onRow={(t) => ({
        onClick: (e) => navigateToTask(t.id, e.metaKey),
      })}
      columns={[
        {
          key: "organization",
          width: 64 + 8 * 2,
          render: (_: unknown, task: TaskWithOrganization | undefined) =>
            !!task ? (
              <Link href={task.project.organization.permalink}>
                <a onClick={stopPropagation}>
                  <OrganizationAvatar
                    organization={task.project.organization}
                    size={64}
                    tooltip={{ title: "View DAO profile" }}
                  />
                </a>
              </Link>
            ) : (
              <Skeleton.Avatar active size={64} />
            ),
        },
        {
          key: "overview",
          render: (_: unknown, task: TaskWithOrganization | undefined) =>
            !!task ? (
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
            ) : (
              <Skeleton
                active
                title={false}
                style={{ display: "flex" }}
                paragraph={{ rows: 2, style: { margin: 0 } }}
              />
            ),
        },
        ...(screens.sm
          ? [
              {
                title: "Reward",
                dataIndex: "reward",
                width: 120,
                render: (reward: TaskReward | undefined) =>
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
                render: (_: unknown, task: TaskWithOrganization | undefined) =>
                  !!task &&
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
