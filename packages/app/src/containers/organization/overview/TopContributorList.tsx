import React, { FC, useMemo, useState } from "react";
import { useOrganizationTasks } from "../hooks";

import { TaskStatus, User } from "@dewo/app/graphql/types";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { Table, Space, Typography, Button, Row } from "antd";
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
}

const TopContributorExports: FC<ExportProps> = ({ users }) => {
  const headers = useMemo(
    () => [
      { label: "Username", key: "username" },
      { label: "Tasks Done", key: "tasksDone" },
      { label: "Task Points", key: "taskPoints" },
      { label: "Earned", key: "earned" },
    ],
    []
  );

  return (
    <CSVLink filename="top-contributors.csv" data={users} headers={headers}>
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
            tasksDone: 0,
            taskPoints: 0,
            earned: 0,
          };
        }
        users[assignee.id].tasksDone++;
        users[assignee.id].taskPoints += task.storyPoints || 0;
        for (const reward of task.rewards) {
          users[assignee.id].earned += calculateTaskRewardAsUSD(reward) || 0;
        }
      });
    });
    return Object.values(users).sort((a, b) => b.tasksDone - a.tasksDone);
  }, [organization]);
  return (
    <Space direction="vertical" className="w-full">
      <Row align="middle">
        <Typography.Title level={5} style={{ margin: 0 }}>
          Top Contributors
        </Typography.Title>
        <DateRangePicker onSetRange={setRange} />
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
      {canUpdateOrganization && <TopContributorExports users={contributors} />}
    </Space>
  );
};
