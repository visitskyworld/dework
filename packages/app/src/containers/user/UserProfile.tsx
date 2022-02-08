import React, { FC, useMemo } from "react";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import Link from "next/link";
import { useUser, useUserTasks } from "./hooks";
import { TaskStatus } from "@dewo/app/graphql/types";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { UserProfileForm } from "./UserProfileForm";
import { TaskBoardColumnEmpty } from "../task/board/TaskBoardColumnEmtpy";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { TaskCard } from "../task/board/TaskCard";

interface Props {
  userId: string;
}

export const UserProfile: FC<Props> = ({ userId }) => {
  const user = useUser(userId);
  const isMe = useAuthContext().user?.id === userId;
  const tasks = useUserTasks(userId);
  const completedTasks = useMemo(
    () => tasks?.filter((t) => t.status === TaskStatus.DONE),
    [tasks]
  );

  if (!user) return null;
  return (
    <div className="mx-auto max-w-lg" style={{ marginTop: 40 }}>
      <Row gutter={[16, 16]} style={{ margin: 0 }}>
        <Col xs={24} md={8}>
          <Card>
            <UserProfileForm userId={userId} />
            <Typography.Text
              className="dewo-label"
              style={{ marginTop: 16, display: "block" }}
            >
              Proof of Work
            </Typography.Text>
            <Row gutter={[8, 8]} style={{ margin: 0 }}>
              <Tag style={{ backgroundColor: Colors.volcano.primary }}>
                <Icons.FireFilled />
                <Typography.Text>
                  X% satisfaction (incoming metric..)
                </Typography.Text>
              </Tag>
              <Tag style={{ backgroundColor: Colors.blue.primary }}>
                <Icons.DollarCircleOutlined />
                <Typography.Text>0 earned</Typography.Text>
              </Tag>
            </Row>

            {!!user.organizations.length && (
              <>
                <Typography.Text
                  className="dewo-label"
                  style={{ marginTop: 12, display: "block" }}
                >
                  Organizations
                </Typography.Text>
                <Row gutter={[8, 8]} style={{ margin: 0 }}>
                  {user.organizations.map((organization) => (
                    <Link key={organization.id} href={organization.permalink}>
                      <a>
                        <Tag>{organization.name}</Tag>
                      </a>
                    </Link>
                  ))}
                </Row>
              </>
            )}
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card size="small" title="Completed tasks">
            {!!completedTasks && !completedTasks.length && (
              <TaskBoardColumnEmpty
                icon={<Icons.CoffeeOutlined />}
                title={
                  <>
                    <Typography.Paragraph>
                      No tasks completed yet!
                    </Typography.Paragraph>
                    {isMe && (
                      <Button href="/" type="primary">
                        Explore open bounties
                      </Button>
                    )}
                  </>
                }
              />
            )}
            <Space direction="vertical" style={{ width: "100%" }}>
              {completedTasks?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  style={{ cursor: "pointer" }}
                  showReview
                />
              ))}
            </Space>
          </Card>
          <TaskUpdateModalListener />
        </Col>
      </Row>
    </div>
  );
};
