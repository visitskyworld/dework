import { Avatar, Col, Layout, Row, Tabs, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC } from "react";
import { useOrganization } from "../hooks";
import { CoverImageLayout } from "@dewo/app/components/CoverImageLayout";
import { ProjectCard } from "./ProjectCard";
import { colorFromUuid } from "@dewo/app/util/colorFromUuid";
import { CreateProjectCard } from "./CreateProjectCard";
import { OrganizationTaskBoard } from "./OrganizationTaskBoard";
import { OrganizationMemberList } from "./OrganizationMemberList";

interface OrganizationOverviewProps {
  organizationId: string;
}

export const OrganizationOverview: FC<OrganizationOverviewProps> = ({
  organizationId,
}) => {
  const organization = useOrganization(organizationId);
  return (
    <>
      <CoverImageLayout
        imageUrl="https://image.freepik.com/free-vector/gradient-liquid-abstract-background_23-2148902633.jpg"
        avatar={
          <Avatar
            src={organization?.imageUrl}
            size={128}
            style={{ backgroundColor: colorFromUuid(organizationId) }}
            icon={<Icons.TeamOutlined />}
          />
        }
      >
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          {organization?.name}
        </Typography.Title>
        <Typography.Text style={{ textAlign: "center" }}>
          {organization?.description}
        </Typography.Text>
      </CoverImageLayout>
      <Tabs defaultActiveKey="projects" centered>
        <Tabs.TabPane tab="Projects" key="projects">
          <Layout.Content className="max-w-lg mx-auto">
            <Row gutter={[0, 16]}>
              {organization?.projects.map((project) => (
                <Col
                  key={project.id}
                  span={8}
                  style={{ paddingLeft: 8, paddingRight: 8 }}
                >
                  <ProjectCard
                    project={project}
                    users={organization?.members.map((m) => m.user) ?? []}
                  />
                </Col>
              ))}
              <Col span={8} style={{ paddingLeft: 8, paddingRight: 8 }}>
                <CreateProjectCard organizationId={organizationId} />
              </Col>
            </Row>
          </Layout.Content>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Board" key="board">
          <Layout.Content className="max-w-lg mx-auto">
            <OrganizationTaskBoard organizationId={organizationId} />
          </Layout.Content>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Members" key="members">
          <Layout.Content className="max-w-lg mx-auto">
            <OrganizationMemberList organizationId={organizationId} />
          </Layout.Content>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};
