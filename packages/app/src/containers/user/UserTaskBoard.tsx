import React, { FC, useMemo } from "react";
import { TaskStatusEnum } from "@dewo/app/graphql/types";
import { Avatar, Card, Col, List, Row, Space } from "antd";
import * as Icons from "@ant-design/icons";
import { OrganizationCard } from "../landingPage/OrganizationCard";
import { useFeaturedOrganizations } from "../organization/hooks";
import { TaskBoard } from "../project/board/TaskBoard";
import { TaskCard } from "../project/board/TaskCard";
import { TaskSectionTitle } from "../project/board/TaskSectionTitle";
import { useTasks } from "../task/hooks";
import { useUserTasks } from "./hooks";
import { TaskBoardColumnEmptyProps } from "../project/board/TaskBoardColumnEmtpy";
import { CreateOrganizationButton } from "../navigation/CreateOrganizationButton";

interface Props {
  userId: string;
}

const empty: Partial<Record<TaskStatusEnum, TaskBoardColumnEmptyProps>> = {
  [TaskStatusEnum.IN_PROGRESS]: {
    title: "First apply to tasks, then the ones assigned to you appear here",
    icon: <Icons.ThunderboltOutlined />,
  },
  [TaskStatusEnum.IN_REVIEW]: {
    title: "When you're done with a task, put it here for review by the DAO",
    icon: <Icons.SafetyOutlined />,
  },
  [TaskStatusEnum.DONE]: {
    title: "Keep track of your completed tasks and reward payment here",
    icon: <Icons.DollarCircleOutlined />,
  },
};

export const UserTaskBoard: FC<Props> = ({ userId }) => {
  const tasks = useUserTasks(userId, "cache-and-network");
  const organizations = useFeaturedOrganizations(3);
  const latestTasks = useTasks(
    useMemo(
      () => ({
        statuses: [TaskStatusEnum.TODO],
        limit: 100,
        organizationIds: organizations?.map((o) => o.id),
      }),
      [organizations]
    ),
    !organizations
  );

  if (!tasks) return null;
  return (
    <TaskBoard
      tasks={tasks}
      empty={empty}
      footer={{
        [TaskStatusEnum.TODO]: (
          <Row gutter={[8, 8]}>
            {!!organizations?.length && (
              <Col span={24}>
                <TaskSectionTitle title="Explore DAOs" />
                <Space
                  direction="vertical"
                  style={{ width: "100%", marginBottom: 8 }}
                >
                  {organizations.map((organization) => (
                    <OrganizationCard
                      organization={organization}
                      title={{ level: 5 }}
                    />
                  ))}
                  <CreateOrganizationButton
                    block
                    type="text"
                    style={{
                      height: "unset",
                      margin: "0 auto",
                      textAlign: "left",
                      padding: 0,
                    }}
                  >
                    <Card size="small">
                      <List.Item.Meta
                        avatar={
                          <Avatar>
                            <Icons.PlusOutlined />
                          </Avatar>
                        }
                        title="Set up your own DAO"
                      />
                    </Card>
                  </CreateOrganizationButton>
                </Space>
              </Col>
            )}
            {!!latestTasks?.length && (
              <Col span={24}>
                <TaskSectionTitle title="Apply to new tasks" />
                <Space
                  direction="vertical"
                  style={{ width: "100%", marginBottom: 8 }}
                >
                  {latestTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Space>
              </Col>
            )}
          </Row>
        ),
      }}
    />
  );
};
