import React, { FC, useMemo, useState } from "react";
import { useOrganizationTasks, useOrganizationUsers } from "../hooks";

import {
  TaskReward,
  TaskStatus,
  ThreepidSource,
  User,
} from "@dewo/app/graphql/types";
import _ from "lodash";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { Table, Space, Typography, Button, Row, Col } from "antd";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { calculateTaskRewardAsUSD } from "../../task/hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { DateRangePicker } from "@dewo/app/components/DateRangePicker";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import styles from "./Contributor.module.less";

interface Props {
  organizationId: string;
}
export interface Contributor extends User {
  tasksDone: number;
  taskPoints: number;
  earned: number;
}
interface ExportProps {
  users: Contributor[];
  organizationId: string;
}
const TopContributorExports: FC<ExportProps> = ({ users, organizationId }) => {
  const { users: usersWithThreePids } = useOrganizationUsers(organizationId);
  const addressByUserId = useMemo(() => {
    const groupedByUserId = _.keyBy(usersWithThreePids, "id");
    return _.mapValues(
      groupedByUserId,
      (u) =>
        u?.threepids?.find((t) => t.source === ThreepidSource.metamask)
          ?.threepid
    );
  }, [usersWithThreePids]);

  const headers = useMemo(
    () => [
      { label: "Username", key: "username" },
      { label: "Wallet address", key: "address" },
      { label: "Tasks Done", key: "tasksDone" },
      { label: "Task Points", key: "taskPoints" },
      { label: "Earned", key: "earned" },
    ],
    []
  );

  const csvData = useMemo(() => {
    return users.map((user) => ({
      ...user,
      address: addressByUserId[user.id],
    }));
  }, [users, addressByUserId]);

  return (
    <CSVLink filename="top-contributors.csv" data={csvData} headers={headers}>
      <Button
        icon={<ExportOutlined />}
        name="Export organization top contributors as CSV"
      >
        {"Export as CSV"}
      </Button>
    </CSVLink>
  );
};

export const TopContributorList: FC<Props> = ({ organizationId }) => {
  const [page, setPage] = useState(1);
  const [range, setRange] = useState(["", ""]);
  const navigateToProfile = useNavigateToProfile();
  const organization = useOrganizationTasks(
    organizationId,
    {
      statuses: [TaskStatus.DONE],
      doneAtAfter: range[0] ? range[0] : undefined,
      doneAtBefore: range[1] ? range[1] : undefined,
    },
    "cache-and-network"
  );
  const canUpdateOrganization = usePermission("update", "Organization");
  const contributors = useMemo(() => {
    const users: Record<string, Contributor> = {};
    organization?.tasks.map((task) => {
      task.assignees.map((assignee) => {
        if (!users[assignee.id]) {
          users[assignee.id] = {
            ...assignee,
            tasksDone: 1,
            taskPoints: task.storyPoints || 0,
            earned: calculateTaskRewardAsUSD(task.reward as TaskReward) || 0,
          };
        } else {
          users[assignee.id].tasksDone++;
          users[assignee.id].taskPoints += task.storyPoints || 0;
          users[assignee.id].earned +=
            calculateTaskRewardAsUSD(task.reward as TaskReward) || 0;
        }
      });
    });
    return Object.values(users).sort((a, b) => b.tasksDone - a.tasksDone);
  }, [organization]);
  return (
    <Space direction="vertical" className="w-full">
      <Row>
        <Col>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Top Contributors
          </Typography.Title>
        </Col>
        <Col flex={1}>
          <DateRangePicker onSetRange={setRange} />
        </Col>
      </Row>
      <Table<Contributor>
        scroll={{ x: 240 }}
        loading={!organization}
        dataSource={contributors}
        size="small"
        pagination={{
          hideOnSinglePage: true,
          onChange: setPage,
        }}
        onRow={(user) => ({ onClick: () => navigateToProfile(user) })}
        className={styles.fixed}
        style={{ cursor: "pointer" }}
        columns={[
          {
            title: "Rank",
            render: (_, _user, index) => (page - 1) * 10 + index + 1,
          },
          {
            title: "Username",
            dataIndex: "username",
            render: (_, user) => (
              <Space>
                <UserAvatar user={user} />
                <Typography.Text>{user.username}</Typography.Text>
              </Space>
            ),
          },
          {
            title: "Tasks Done",
            dataIndex: "tasksDone",
            render: (tasksDone) => (tasksDone ? tasksDone : "-"),
            sorter: (a, b) => (a.tasksDone > b.tasksDone ? 1 : -1),
          },
          {
            title: "Task Points",
            dataIndex: "taskPoints",
            render: (taskPoints) => (taskPoints ? taskPoints : "-"),
            sorter: (a, b) => a.taskPoints - b.taskPoints,
          },
          {
            title: "Earned",
            dataIndex: "earned",
            render: (earned) => "$ " + earned.toFixed(2),
            sorter: (a, b) => a.earned - b.earned,
          },
        ]}
      />
      {canUpdateOrganization && (
        <TopContributorExports
          users={contributors}
          organizationId={organizationId}
        />
      )}
    </Space>
  );
};