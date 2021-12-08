import { Project } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import {
  Avatar,
  Button,
  Col,
  Layout,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback } from "react";
import { useOrganization } from "../hooks";
import { ProjectCreateModal } from "../../project/create/ProjectCreateModal";
import { InviteButton } from "../../invite/InviteButton";
import { CoverImageLayout } from "@dewo/app/components/CoverImageLayout";
import { ProjectCard } from "./ProjectCard";

interface OrganizationOverviewProps {
  organizationId: string;
}

export const OrganizationOverview: FC<OrganizationOverviewProps> = ({
  organizationId,
}) => {
  const organization = useOrganization(organizationId);

  const createProject = useToggle();
  const router = useRouter();
  const handleProjectCreated = useCallback(
    async (project: Project) => {
      createProject.onToggleOff();
      await router.push(
        "/organization/[organizationId]/project/[projectId]",
        `/organization/${organizationId}/project/${project.id}`
      );
    },
    [router, createProject, organizationId]
  );

  return (
    <>
      <CoverImageLayout
        imageUrl="https://image.freepik.com/free-vector/gradient-liquid-abstract-background_23-2148902633.jpg"
        avatar={
          <Avatar
            src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg"
            className="pointer-cursor"
            size={128}
            icon={<Icons.GroupOutlined />}
          />
        }
      >
        <Typography.Title level={3}>{organization?.name}</Typography.Title>
        <Typography.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc sed
          blandit libero volutpat sed cras. In hac habitasse platea dictumst
          vestibulum rhoncus est pellentesque. Pretium viverra suspendisse
          potenti nullam.
        </Typography.Text>

        <Row style={{ marginTop: 24 }}>
          <Space>
            <Button type="ghost" onClick={createProject.onToggleOn}>
              Create Project
            </Button>
            <InviteButton organizationId={organizationId} />
          </Space>
        </Row>

        <ProjectCreateModal
          visible={createProject.value}
          organizationId={organizationId}
          onCancel={createProject.onToggleOff}
          onCreated={handleProjectCreated}
        />
      </CoverImageLayout>
      <Tabs defaultActiveKey="projects" centered>
        <Tabs.TabPane tab="Projects" key="projects">
          <Layout.Content className="max-w-lg mx-auto">
            <Row gutter={[16, 16]}>
              {organization?.projects.map((project) => (
                <Col key={project.id} span={8}>
                  <ProjectCard project={project} />
                </Col>
              ))}
              {organization?.projects.map((project) => (
                <Col key={project.id} span={8}>
                  <ProjectCard project={project} />
                </Col>
              ))}
              {organization?.projects.map((project) => (
                <Col key={project.id} span={8}>
                  <ProjectCard project={project} />
                </Col>
              ))}
            </Row>
          </Layout.Content>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Board" key="board"></Tabs.TabPane>
        <Tabs.TabPane tab="About" key="about"></Tabs.TabPane>
      </Tabs>
    </>
  );
};
