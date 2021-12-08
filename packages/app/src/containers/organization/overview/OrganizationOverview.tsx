import { Avatar, Col, Layout, Row, Tabs, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC } from "react";
import { useOrganization } from "../hooks";
import { InviteButton } from "../../invite/InviteButton";
import { CoverImageLayout } from "@dewo/app/components/CoverImageLayout";
import { ProjectCard } from "./ProjectCard";
import { colorFromUuid } from "@dewo/app/util/colorFromUuid";
import { CreateProjectCard } from "./CreateProjectCard";

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
            className="pointer-cursor"
            size={128}
            style={{ backgroundColor: colorFromUuid(organizationId) }}
            icon={<Icons.TeamOutlined />}
          />
        }
      >
        <Typography.Title level={3}>{organization?.name}</Typography.Title>
        <Typography.Text>{organization?.description}</Typography.Text>

        <Row style={{ marginTop: 24 }}>
          <InviteButton organizationId={organizationId} />
        </Row>
      </CoverImageLayout>
      <Tabs defaultActiveKey="projects" centered>
        <Tabs.TabPane tab="Projects" key="projects">
          <Layout.Content className="max-w-lg mx-auto">
            <Row gutter={[16, 16]}>
              {organization?.projects.map((project) => (
                <Col key={project.id} span={8}>
                  <ProjectCard
                    project={project}
                    users={organization?.users ?? []}
                  />
                </Col>
              ))}
              <Col span={8}>
                <CreateProjectCard organizationId={organizationId} />
              </Col>
            </Row>
          </Layout.Content>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Board" key="board"></Tabs.TabPane>
        <Tabs.TabPane tab="About" key="about"></Tabs.TabPane>
      </Tabs>
    </>
  );
};
