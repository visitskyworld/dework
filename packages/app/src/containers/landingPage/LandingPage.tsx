import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Col, Divider, Row, Space, Typography } from "antd";
import React, { FC } from "react";
import { UserTaskBoard } from "../user/UserTaskBoard";
import { siteTitle, siteDescription } from "../../../pages/copy";
import { ProjectCard } from "../organization/overview/ProjectCard";
import { usePopularOrganizations } from "../organization/hooks";

interface Props {}

export const LandingPage: FC<Props> = () => {
  const { user } = useAuthContext();

  const popularOrganizations = usePopularOrganizations() || [];
  const popularProjects = popularOrganizations?.filter(
    (org) => org.projects[0]
  );

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
        <Divider />
        <Typography.Title
          level={2}
          style={{ textAlign: "center", width: "100%" }}
        >
          Popular projects
        </Typography.Title>
        <Row>
          {popularProjects?.map((project) => (
            <Col span={12} key={project.name}>
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
