import React, { FC, useMemo } from "react";
import {
  Button,
  Card,
  ConfigProvider,
  Empty,
  Modal,
  Skeleton,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import {
  TaskStatus,
  TaskViewSortByDirection,
  TaskViewSortByField,
  SearchTasksInput,
} from "@dewo/app/graphql/types";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { UserSettings } from "../user/UserSettings";
import { useMounted, useToggle } from "@dewo/app/util/hooks";
import { useTaskViewLayoutData } from "../task/views/hooks";
import { TaskDiscoveryTable } from "../discovery/TaskDiscoveryTable";

export const RecommendedTasksList: FC = () => {
  const { user } = useAuthContext();

  const organizationIds = useMemo(
    () => user?.organizations.map(({ id }) => id) ?? [],
    [user]
  );

  const skillIds = useMemo(
    () => user?.skills.map(({ id }) => id) ?? [],
    [user]
  );

  const searchTasksInputs = useMemo(
    (): SearchTasksInput[] => [
      {
        statuses: [TaskStatus.TODO],
        sortBy: {
          field: TaskViewSortByField.createdAt,
          direction: TaskViewSortByDirection.DESC,
        },
        skillIds: !!skillIds.length ? skillIds : undefined,
        assigneeIds: [null],
        organizationIds: !!organizationIds.length ? organizationIds : undefined,
      },
    ],
    [skillIds, organizationIds]
  );

  const [data] = useTaskViewLayoutData(searchTasksInputs, {
    withOrganization: true,
  });

  const mounted = useMounted();

  const userSettings = useToggle();

  if (!mounted) return null;
  return (
    <>
      <Typography.Title level={3}>Open Tasks</Typography.Title>
      <Typography.Paragraph type="secondary">
        Recent tasks from the DAOs you follow, based on your skills
      </Typography.Paragraph>

      {!!organizationIds.length && !!skillIds.length ? (
        <ConfigProvider
          renderEmpty={() => (
            <Empty description="No open tasks matching your skills in the organizations you follow..." />
          )}
        >
          <Skeleton active loading={!data.tasks}>
            <TaskDiscoveryTable data={data} />
          </Skeleton>
        </ConfigProvider>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {organizationIds.length === 0 && (
            <Card
              className="dewo-card-highlighted"
              bodyStyle={{
                display: "flex",
                alignItems: "center",
                padding: 12,
              }}
            >
              <Link href="/">
                <Button style={{ width: 132 }} type="primary">
                  Explore DAOs
                </Button>
              </Link>
              <Typography.Paragraph style={{ margin: 0, marginLeft: 12 }}>
                Follow at least 1 organization
              </Typography.Paragraph>
            </Card>
          )}

          {skillIds.length === 0 && (
            <Card
              className="dewo-card-highlighted"
              bodyStyle={{
                display: "flex",
                alignItems: "center",
                padding: 12,
              }}
            >
              <Button
                style={{ width: 132 }}
                type="primary"
                onClick={userSettings.toggleOn}
              >
                Select Skills
              </Button>
              <Typography.Paragraph style={{ margin: 0, marginLeft: 12 }}>
                Select at least 1 skill
              </Typography.Paragraph>
            </Card>
          )}
        </Space>
      )}

      <Modal
        visible={userSettings.isOn}
        title="Settings"
        footer={null}
        onCancel={userSettings.toggleOff}
      >
        <UserSettings />
      </Modal>
    </>
  );
};
