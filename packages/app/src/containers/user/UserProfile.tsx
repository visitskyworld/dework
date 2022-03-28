import React, { FC, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Row, Space, Spin, Tag, Typography } from "antd";
import _ from "lodash";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { useUser, useUserRoles, useUserTasks } from "./hooks";
import { TaskStatus } from "@dewo/app/graphql/types";
import { UserProfileForm } from "./UserProfileForm";
import { TaskBoardColumnEmpty } from "../task/board/TaskBoardColumnEmtpy";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { TaskCard } from "../task/card/TaskCard";
import { calculateTaskRewardAsUSD } from "../task/hooks";
import { UserOrganizationCard } from "./UserOrganizationCard";

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
  const amountEarned = useMemo(
    () =>
      _.sumBy(completedTasks, (t) =>
        t.assignees.some((a) => a.id === userId) && !!t.reward?.payment
          ? _.round(calculateTaskRewardAsUSD(t?.reward) ?? 0)
          : 0
      ),
    [completedTasks, userId]
  );

  const roles = useUserRoles(userId)?.roles;
  const rolesByOrganization = useMemo(() => {
    const filtered = roles?.filter((r) => !r.fallback);
    return _.groupBy(filtered, (role) => role.organizationId);
  }, [roles]);
  const organizations = useMemo(() => {
    const filtered = user?.organizations.filter(
      (o) => !!rolesByOrganization[o.id]?.length
    );
    return _.sortBy(
      filtered,
      (o) => rolesByOrganization[o.id]?.length
    ).reverse();
  }, [user?.organizations, rolesByOrganization]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
                <Typography.Text>{`$${amountEarned} earned`}</Typography.Text>
              </Tag>
            </Row>

            {!!organizations.length && (
              <>
                <Typography.Text
                  className="dewo-label"
                  style={{ marginTop: 12, display: "block" }}
                >
                  Organizations
                </Typography.Text>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {organizations.map((o) => (
                    <UserOrganizationCard
                      key={o.id}
                      userId={userId}
                      organization={o}
                    />
                  ))}
                </Space>
              </>
            )}
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card size="small" title="Completed tasks">
            {!mounted || !completedTasks ? (
              <div style={{ display: "grid", padding: 16 }}>
                <Spin />
              </div>
            ) : !completedTasks.length ? (
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
            ) : (
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
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
