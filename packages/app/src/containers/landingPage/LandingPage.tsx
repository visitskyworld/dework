import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Icons from "@ant-design/icons";
import {
  Button,
  Image,
  Card,
  Col,
  Divider,
  PageHeader,
  Row,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from "antd";
import React, { FC, useMemo } from "react";
import { useFeaturedOrganizations } from "../organization/hooks";
import { OrganizationCard } from "./OrganizationCard";
import { siteTitle, siteDescription } from "@dewo/app/util/constants";
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

  if (Math.random()) {
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
          extra={[
            <LoginButton key="log-in" type="text">
              Log In
            </LoginButton>,
            !user && (
              <LoginButton key="get-started" type="primary">
                Get Started
              </LoginButton>
            ),
          ]}
          style={{ width: "100%" }}
          className="max-w-lg mx-auto"
        />
        <Row className="max-w-lg mx-auto" style={{ width: "100%" }}>
          <Col md={12} xs={24} style={{ padding: "96px 24px" }}>
            <Space direction="vertical" size="large">
              <Typography.Title level={1}>
                A web3-native Asana with crypto payments, credentialing,
                bounties and more
              </Typography.Title>
              <Row>
                <Row style={{ width: 100 }}>
                  <Divider />
                </Row>
                <Typography.Paragraph style={{ fontSize: "150%" }}>
                  Manage your tasks and bounties in one place. Get bounty
                  applicants, sync with Discord, boost the reputation of
                  contributors, and pay with your own DAO's tokens
                </Typography.Paragraph>
              </Row>

              <Space>
                <LoginButton type="primary" size="large">
                  Get Started
                </LoginButton>
                <Button
                  type="text"
                  size="large"
                  icon={<Icons.PlayCircleOutlined />}
                >
                  Watch Video
                </Button>
              </Space>
            </Space>
          </Col>
          <Col
            md={12}
            xs={24}
            style={{ padding: 24, display: "grid", placeItems: "center" }}
          >
            <Tabs centered type="line" className="dewo-lp-feature-tabs">
              <Tabs.TabPane
                tab="Feature X"
                key="feature-x"
                style={{ padding: 8 }}
              >
                <Image
                  width="100%"
                  src="https://storage.googleapis.com/assets.dework.xyz/uploads/7c830d17-de1d-4245-a032-c4723d9c6a25/image.png"
                />
                <Typography.Paragraph
                  type="secondary"
                  style={{
                    textAlign: "center",
                    fontSize: "130%",
                    marginTop: 16,
                  }}
                >
                  Feature X is a feature that will be released soon.
                </Typography.Paragraph>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Feature Y" key="feature-y">
                Content of Tab Pane 1
              </Tabs.TabPane>
              <Tabs.TabPane tab="Feature Z" key="feature-z">
                Content of Tab Pane 1
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
        <Row
          style={{
            padding: "96px 24px",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        >
          <Col className="max-w-lg mx-auto" style={{ width: "100%" }}>
            <Typography.Title
              level={4}
              style={{ textAlign: "center", width: "100%" }}
            >
              Explore some popular DAOs
            </Typography.Title>
            <Row gutter={[16, 16]} style={{ margin: 0, width: "100%" }}>
              {organizations?.map((org) => (
                <Col xs={24} md={24 / NUM_COLUMNS} key={org.id}>
                  <OrganizationCard organization={org} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </>
    );
  }

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
        extra={!user && <LoginButton type="primary">Sign in</LoginButton>}
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
          <Typography.Paragraph style={{ textAlign: "center", width: "100%" }}>
            {siteDescription}
          </Typography.Paragraph>
          {!user && (
            <LoginButton type="primary" size="large" className="mx-auto">
              Log in
            </LoginButton>
          )}
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

  // return (
  //   <>
  //     <MobileHeader asHeader={true} />
  //     <Space
  //       direction="vertical"
  //       className="mx-auto dewo-landing-page-main"
  //       style={{
  //         marginTop: 40,
  //         maxWidth: 300 * 4 + (3 + 2) * 16,
  //         maxHeight: "100%",
  //       }}
  //     >
  //       <Typography.Title
  //         level={3}
  //         style={{ textAlign: "center", width: "100%" }}
  //       >
  //         Your tasks for today
  //       </Typography.Title>

  //       <UserTaskBoard userId={user.id} />
  //     </Space>
  //   </>
  // );
};
