import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import {
  TaskGatingType,
  TaskReward,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Button, Skeleton, Table, Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { SortOrder, TablePaginationConfig } from "antd/lib/table/interface";
import _ from "lodash";
import moment from "moment";
import Link from "next/link";
import React, { FC, useEffect, useMemo, useState } from "react";
import { CreateSubmissionButton } from "../task/actions/submit/CreateSubmissionButton";
import { TaskTagsRow } from "../task/card/TaskTagsRow";
import {
  calculateTaskRewardAsUSD,
  formatTaskReward,
  formatTaskRewardAsUSD,
} from "../task/hooks";
import { TaskViewLayoutData } from "../task/views/hooks";

interface Props {
  data: TaskViewLayoutData;
  pageSize?: number;
}

export const TaskDiscoveryTable: FC<Props> = ({ data, pageSize = 10 }) => {
  const navigateToTask = useNavigateToTaskFn();
  const screens = useBreakpoint();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize,
  });
  const rows = useMemo(
    () =>
      _.range((data.hasMore ? data.total : data.tasks?.length) ?? 0).map(
        (index) => data.tasks?.[index] as TaskWithOrganization
      ),
    [data.hasMore, data.total, data.tasks]
  );

  const isLastTaskLoaded = useMemo(() => {
    if (!pagination?.current || !pagination?.pageSize) return true;
    const lastTaskIndex = pagination.current * pagination.pageSize - 1;
    return !!data.tasks?.[lastTaskIndex];
  }, [pagination, data.tasks]);
  useEffect(() => {
    if (!data.loading && !isLastTaskLoaded) {
      data.fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.loading, isLastTaskLoaded]);

  return (
    <Table
      dataSource={rows}
      pagination={{ hideOnSinglePage: true, ...pagination }}
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
          render: (__: unknown, task: TaskWithOrganization | undefined) =>
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
                  {moment(task.createdAt).fromNow()} by{" "}
                  {task.project.organization.name}
                </Typography.Paragraph>
                <TaskTagsRow task={_.omit(task, ["project"])} />
                {!screens.lg && !!task.reward && (
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
                {!screens.lg && (
                  <div onClick={stopPropagation}>
                    {task.gating === TaskGatingType.OPEN_SUBMISSION ? (
                      <CreateSubmissionButton
                        task={task}
                        size="small"
                        type="text"
                      />
                    ) : (
                      <Button
                        size="small"
                        type="text"
                        children="I'm interested"
                        onClick={() => navigateToTask(task.id)}
                      />
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
        ...(screens.lg
          ? [
              {
                title: "Reward",
                dataIndex: "reward",
                width: 120,
                render: (reward: TaskReward | undefined) =>
                  screens.lg &&
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
                  screens.lg && (
                    <div onClick={stopPropagation}>
                      {task.gating === TaskGatingType.OPEN_SUBMISSION ? (
                        <CreateSubmissionButton
                          task={task}
                          size="small"
                          type="text"
                        />
                      ) : (
                        <Button
                          size="small"
                          type="text"
                          children="I'm interested"
                          onClick={() => navigateToTask(task.id)}
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
