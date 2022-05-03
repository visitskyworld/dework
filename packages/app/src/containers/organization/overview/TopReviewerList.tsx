import React, { FC, useMemo, useState } from "react";
import { useOrganizationTasks, useOrganizationUsers } from "../hooks";

import { User, TaskStatus, ThreepidSource } from "@dewo/app/graphql/types";
import { CSVLink } from "react-csv";
import _ from "lodash";
import { ExportOutlined } from "@ant-design/icons";
import { Table, Space, Typography, Button, Row, Col } from "antd";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { DateRangePicker } from "@dewo/app/components/DateRangePicker";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import styles from "./Contributor.module.less";
interface Props {
  organizationId: string;
}
interface ExportProps {
  users: Reviewer[];
  organizationId: string;
}
export interface Reviewer extends User {
  tasksReviewed: number;
  taskPoints: number;
}

const TopReviewerExports: FC<ExportProps> = ({ users, organizationId }) => {
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
      { label: "Tasks Reviewed", key: "tasksReviewed" },
      { label: "Task Points", key: "taskPoints" },
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
    <CSVLink filename="top-reviewers.csv" data={csvData} headers={headers}>
      <Button
        icon={<ExportOutlined />}
        name="Export organization top reviewers as CSV"
      >
        {"Export as CSV"}
      </Button>
    </CSVLink>
  );
};

export const TopReviewerList: FC<Props> = ({ organizationId }) => {
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
  const reviewers = useMemo(() => {
    const users: Record<string, Reviewer> = {};
    organization?.tasks.map((task) => {
      task.owners.map((owner) => {
        if (!users[owner.id]) {
          users[owner.id] = {
            ...owner,
            tasksReviewed: 1,
            taskPoints: task.storyPoints || 0,
          };
        } else {
          users[owner.id].tasksReviewed++;
          users[owner.id].taskPoints += task.storyPoints || 0;
        }
      });
    });
    return Object.values(users).sort(
      (a, b) => b.tasksReviewed - a.tasksReviewed
    );
  }, [organization]);
  return (
    <Space direction="vertical" className="w-full">
      <Row>
        <Col>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Top Reviewers
          </Typography.Title>
        </Col>
        <Col flex={1}>
          <DateRangePicker onSetRange={setRange} />
        </Col>
      </Row>
      <Table<Reviewer>
        scroll={{ x: 240 }}
        className={styles.fixed}
        loading={!organization}
        dataSource={reviewers}
        size="small"
        pagination={{
          hideOnSinglePage: true,
          onChange: setPage,
        }}
        onRow={(user) => ({ onClick: () => navigateToProfile(user) })}
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
            title: "Tasks Reviewed",
            dataIndex: "tasksReviewed",
            render: (tasksReviewed) => (tasksReviewed ? tasksReviewed : "-"),
            sorter: (a, b) => (a.tasksReviewed > b.tasksReviewed ? 1 : -1),
          },
          {
            title: "Task Points",
            dataIndex: "taskPoints",
            render: (taskPoints) => (taskPoints ? taskPoints : "-"),
            sorter: (a, b) => a.taskPoints - b.taskPoints,
          },
        ]}
      />
      {canUpdateOrganization && (
        <TopReviewerExports users={reviewers} organizationId={organizationId} />
      )}
    </Space>
  );
};
