import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Col, Row, Space, Typography } from "antd";
import React, { FC } from "react";
import { UserTaskBoard } from "../user/UserTaskBoard";
import { siteTitle, siteDescription } from "../../../pages/copy";
import { ProjectCard } from "../organization/overview/ProjectCard";
import { usePopularOrganizations } from "../organization/hooks";

interface Props {}

export const LandingPage: FC<Props> = () => {
  const { user } = useAuthContext();

  const projects = usePopularOrganizations();
  console.log(projects);

  if (!user)
    return (
      <Space direction="vertical" style={{ flex: 1, display: "flex" }}>
        <Typography.Title
          level={1}
          style={{ width: "100%", maxWidth: "100%", textAlign: "center" }}
        >
          {siteTitle}
        </Typography.Title>
        <Typography.Paragraph style={{ textAlign: "center", width: "100%" }}>
          {siteDescription}
        </Typography.Paragraph>
        <Row>
          {projects?.map((project) => (
            <Col span={12} offset={6}>
              <ProjectCard project={project} users={[]}></ProjectCard>
            </Col>
          ))}
        </Row>
      </Space>
    );

  return (
    <Space direction="vertical">
      <Typography.Title
        level={3}
        style={{ textAlign: "center", width: "100%" }}
      >
        Your tasks for today
      </Typography.Title>
      <UserTaskBoard userId={user.id} />
    </Space>
  );
};
