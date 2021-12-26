import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import {
  Card,
  Col,
  Divider,
  PageHeader,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import React, { FC, useMemo } from "react";
import { UserTaskBoard } from "../user/UserTaskBoard";
import { useFeaturedOrganizations } from "../organization/hooks";
import { OrganizationCard } from "./OrganizationCard";
import { siteTitle, siteDescription } from "@dewo/app/util/constants";
import { MobileHeader } from "../navigation/header/MobileHeader";
import { TaskCard } from "../project/board/TaskCard";
import { useTasks } from "../task/hooks";
import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { DeworkIcon } from "@dewo/app/components/icons/Dework";
import _ from "lodash";
import { LoginButton } from "../auth/LoginButton";

const NUM_COLUMNS = 2;

export const LandingPage: FC = () => {
  const { user } = useAuthContext();
  const organizations = useFeaturedOrganizations(4);
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
  const latestTaskChunks = useMemo(() => {
    if (!latestTasks) return [];
    const chunks = _.range(NUM_COLUMNS).map<Task[]>(() => []);
    latestTasks.forEach((task, index) => {
      chunks[index % NUM_COLUMNS].push(task);
    });
    return chunks;
  }, [latestTasks]);

  if (!user)
    return (
      <>
        <PageHeader
          title={
            <Row align="middle">
              <DeworkIcon style={{ width: 24, height: 24, marginRight: 8 }} />
              <Typography.Title level={4} style={{ margin: 0 }}>
                {siteTitle}
              </Typography.Title>
            </Row>
          }
          extra={<LoginButton type="primary">Sign in</LoginButton>}
        />
        <Divider style={{ margin: 0 }} />

        <Row style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          <Row className="max-w-md mx-auto" style={{ padding: 32 }}>
            <Typography.Title
              level={1}
              style={{ width: "100%", maxWidth: "100%", textAlign: "center" }}
            >
              {siteTitle}
            </Typography.Title>
            <Typography.Paragraph
              style={{ textAlign: "center", width: "100%" }}
            >
              {siteDescription}
            </Typography.Paragraph>
            <LoginButton type="primary" size="large" className="mx-auto">
              Log in
            </LoginButton>
          </Row>
        </Row>
        <Divider style={{ margin: 0 }} />

        <Row className="max-w-md mx-auto">
          <Typography.Title
            level={4}
            style={{ textAlign: "center", width: "100%", marginTop: 32 }}
          >
            🏆 Popular DAOs
          </Typography.Title>
          <Row gutter={[16, 16]} style={{ margin: 0, width: "100%" }}>
            {organizations?.map((org) => (
              <Col xs={24} md={24 / NUM_COLUMNS} key={org.id}>
                <OrganizationCard organization={org} />
              </Col>
            ))}
          </Row>

          <Typography.Title
            level={4}
            style={{ textAlign: "center", width: "100%", marginTop: 48 }}
          >
            🔥 Newest tasks
          </Typography.Title>
          <Row gutter={[16, 16]} style={{ margin: 0, width: "100%" }}>
            {latestTaskChunks.map((chunk, index) => (
              <Col xs={24} md={24 / NUM_COLUMNS} key={index}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%", paddingBottom: 8 }}
                >
                  {!latestTasks &&
                    _.range(3).map(() => (
                      <Card size="small">
                        <Skeleton loading />
                      </Card>
                    ))}
                  {chunk.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Space>
              </Col>
            ))}
          </Row>
          <TaskUpdateModalListener />
        </Row>
      </>
    );

  return (
    <>
      <MobileHeader asHeader={true} />
      <Space
        direction="vertical"
        className="mx-auto dewo-landing-page-main"
        style={{
          marginTop: 40,
          maxWidth: 300 * 4 + (3 + 2) * 16,
          maxHeight: "100%",
        }}
      >
        <Typography.Title
          level={3}
          style={{ textAlign: "center", width: "100%" }}
        >
          Your tasks for today
        </Typography.Title>

        <UserTaskBoard userId={user.id} />
      </Space>
    </>
  );
};
