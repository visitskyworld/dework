import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import {
  Button,
  Card,
  Col,
  Divider,
  PageHeader,
  Row,
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
import { TaskStatusEnum } from "@dewo/app/graphql/types";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { DeworkIcon } from "@dewo/app/components/icons/Dework";

export const LandingPage: FC = () => {
  const { user } = useAuthContext();
  const featuredOrganizations = useFeaturedOrganizations(4);
  const latestTasks = useTasks(
    useMemo(() => ({ statuses: [TaskStatusEnum.TODO] }), [])
  );

  if (!user)
    return (
      <>
        <PageHeader
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            // position: "fixed",
            // width: "100%",
            // sticky: "top",
          }}
          title={
            <Row align="middle">
              <DeworkIcon style={{ width: 24, height: 24, marginRight: 8 }} />
              <Typography.Title level={4} style={{ margin: 0 }}>
                {siteTitle}
              </Typography.Title>
            </Row>
          }
          extra={
            <Button type="primary" href="/auth">
              Sign in
            </Button>
          }
        />
        <Divider style={{ margin: 0 }} />

        <Row className="max-w-md mx-auto" style={{ padding: 16 }}>
          <Space direction="vertical" style={{ flex: 1 }}>
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
            <Row style={{ flexDirection: "column", alignItems: "center" }}>
              <Button type="primary" size="large" href="/auth">
                Log in
              </Button>
            </Row>
            <Divider />
            <Typography.Title
              level={2}
              style={{ textAlign: "center", width: "100%" }}
            >
              🏆 Popular DAOs
            </Typography.Title>
            <Row gutter={[16, 16]}>
              {featuredOrganizations?.map((org) => (
                <Col span={12} key={org.id}>
                  <OrganizationCard organization={org} />
                </Col>
              ))}
            </Row>
            <Divider />
            {!!latestTasks && (
              <>
                <Typography.Title
                  level={2}
                  style={{ textAlign: "center", width: "100%" }}
                >
                  🔥 Newest tasks
                </Typography.Title>
                <Card size="small">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {latestTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Space>
                </Card>
                <TaskUpdateModalListener />
              </>
            )}
          </Space>
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
