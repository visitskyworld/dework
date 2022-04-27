import { useOrganizationRoles } from "@dewo/app/containers/rbac/hooks";
import { useUserRoles } from "@dewo/app/containers/user/hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import {
  RulePermission,
  Task,
  TaskGatingType,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { Grid, Row, Skeleton, Space, Table, Tag, Typography } from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useOrganizationTasks } from "../../hooks";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { TaskActionButton } from "@dewo/app/containers/task/actions/TaskActionButton";
import { TaskCardAvatars } from "@dewo/app/containers/task/card/TaskCardAvatars";
import { TaskTagsRow } from "@dewo/app/containers/task/board/TaskTagsRow";
import { TaskRewardTag } from "@dewo/app/containers/task/TaskRewardTag";
import _ from "lodash";

interface Props {
  organizationId: string;
}

export const OrganizationTaskDiscoveryList: FC<Props> = ({
  organizationId,
}) => {
  const breakpoints = Grid.useBreakpoint();
  const organization = useOrganizationTasks(
    organizationId,
    { statuses: [TaskStatus.TODO], userId: null },
    "cache-first"
  );

  const { user } = useAuthContext();
  const userRoles = useUserRoles(user?.id)?.roles;
  const userRoleIds = useMemo(
    () => new Set(userRoles?.map((r) => r.id)),
    [userRoles]
  );

  const organizationRoles = useOrganizationRoles(organizationId);
  const claimableTaskIds = useMemo(
    () =>
      new Set(
        organizationRoles
          ?.filter((role) => userRoleIds.has(role.id))
          .map((role) => role.rules)
          .flat()
          .filter(
            (r) => !!r.taskId && r.permission === RulePermission.MANAGE_TASKS
          )
          .map((r) => r.taskId!)
      ),
    [organizationRoles, userRoleIds]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const openTask = useNavigateToTaskFn();

  const sortKey = useCallback(
    (task: Task) => {
      const rewardMultiplier = !!task.reward ? 0b1000 : 1;
      const relevanceMultiplier = claimableTaskIds.has(task.id)
        ? 0b100
        : task.gating !== TaskGatingType.OPEN_SUBMISSION
        ? 0b010
        : 0b001;
      return (
        new Date(task.createdAt).getTime() *
        relevanceMultiplier *
        rewardMultiplier
      );
    },
    [claimableTaskIds]
  );

  const [selectedTagLabel, setSelectedTagLabel] = useState<string>();
  const tags = useMemo(() => {
    const tags = organization?.tasks.map((task) => task.tags).flat();
    return _.uniqBy(tags, (t) => t.label);
  }, [organization]);
  const filteredTasks = useMemo(
    () =>
      organization?.tasks.filter(
        (t) =>
          !selectedTagLabel ||
          t.tags.some((tag) => tag.label === selectedTagLabel)
      ),
    [organization?.tasks, selectedTagLabel]
  );

  return (
    <>
      <Typography.Title level={4}>Open Tasks</Typography.Title>
      <Skeleton loading={!mounted || !organization}>
        {tags?.length > 0 && (
          <>
            <Row style={{ marginBottom: 8 }}>
              <Typography.Text
                type="secondary"
                className="ant-typography-caption"
              >
                Click on tags to show tasks for
              </Typography.Text>
            </Row>
            <Row gutter={[4, 8]} style={{ marginBottom: 16 }}>
              {tags.map((tag) => (
                <Tag
                  key={tag.id}
                  color={selectedTagLabel !== tag.label ? undefined : tag.color}
                  className="hover:cursor-pointer"
                  style={{
                    opacity:
                      !!selectedTagLabel && selectedTagLabel !== tag.label
                        ? 0.5
                        : undefined,
                  }}
                  onClick={() =>
                    setSelectedTagLabel((prevValue) =>
                      prevValue === tag.label ? undefined : tag.label
                    )
                  }
                >
                  {tag.label}
                </Tag>
              ))}
            </Row>
          </>
        )}

        {!organization?.tasks.length ? (
          <Typography.Paragraph type="secondary">
            This DAO doesn't have any open tasks at the moment!
          </Typography.Paragraph>
        ) : (
          <Table<Task>
            dataSource={filteredTasks}
            size="small"
            showHeader={false}
            className="dewo-card-table"
            pagination={{ hideOnSinglePage: true }}
            rowClassName="hover:cursor-pointer"
            onRow={(t) => ({ onClick: () => openTask(t.id) })}
            columns={[
              {
                key: "avatar",
                width: 1,
                render: (_, task) => <TaskCardAvatars task={task} />,
                defaultSortOrder: "descend",
                sorter: (a, b) => sortKey(a) - sortKey(b),
              },
              {
                key: "name",
                render: (_, task: Task) => (
                  <Space direction="vertical" size="small">
                    <Typography.Text className="font-semibold">
                      {task.name}
                    </Typography.Text>
                    {!breakpoints.sm && (
                      <>
                        <TaskTagsRow task={task} showStandardTags={false} />
                        {!!task.reward && (
                          <TaskRewardTag reward={task.reward} />
                        )}
                        <TaskActionButton task={task} />
                      </>
                    )}
                  </Space>
                ),
              },
              ...(breakpoints.sm
                ? [
                    {
                      key: "tags",
                      render: (_: unknown, task: Task) => (
                        <TaskTagsRow
                          task={task}
                          showStandardTags={false}
                          style={{ justifyContent: "flex-end" }}
                        />
                      ),
                    },
                    {
                      key: "reward",
                      width: 1,
                      render: (_: unknown, task: Task) =>
                        !!task.reward && <TaskRewardTag reward={task.reward} />,
                    },
                    {
                      key: "button",
                      width: 1,
                      render: (_: unknown, task: Task) => (
                        <TaskActionButton task={task} />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        )}
      </Skeleton>
    </>
  );
};
