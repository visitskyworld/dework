import {
  Avatar,
  Button,
  Col,
  Layout,
  List,
  Menu,
  Row,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC } from "react";
import { useOrganization } from "../hooks";
import { CoverImageLayout } from "@dewo/app/components/CoverImageLayout";
import { ProjectCard } from "./ProjectCard";
import { colorFromUuid } from "@dewo/app/util/colorFromUuid";
import { CreateProjectCard } from "./CreateProjectCard";
import { OrganizationTaskBoard } from "./OrganizationTaskBoard";
import { OrganizationMemberList } from "./OrganizationMemberList";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";

interface OrganizationOverviewProps {
  organizationId: string;
}

export const OrganizationOverview: FC<OrganizationOverviewProps> = ({
  organizationId,
}) => {
  const organization = useOrganization(organizationId);

  if (!!organization && Math.random()) {
    return (
      <Layout>
        <Layout.Header
        // style={{ height: "unset", paddingTop: 8, paddingBottom: 8 }}
        >
          <Row align="middle">
            {/* <OrganizationAvatar organization={organization!} size={64} /> */}
            <Col>
              <Typography.Title
                level={2}
                style={{ margin: 0 /*, marginLeft: 16*/ }}
              >
                {organization?.name}
              </Typography.Title>
            </Col>

            {/* <div style={{ flex: 1 }} /> */}

            <Col
              // style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              style={{ marginLeft: 24 }}
            >
              <Menu mode="horizontal">
                <Menu.Item key="1">Projects</Menu.Item>
                <Menu.Item key="2">Board</Menu.Item>
                <Menu.Item key="3">Members</Menu.Item>
              </Menu>
            </Col>
          </Row>
        </Layout.Header>
        <Layout.Content style={{ marginTop: 24 }}>
          <OrganizationTaskBoard organizationId={organizationId} />
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <>
      {/* <CoverImageLayout
        // imageUrl="https://image.freepik.com/free-vector/gradient-liquid-abstract-background_23-2148902633.jpg"
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
      </CoverImageLayout> */}

      {/* <Col className="max-w-sm mx-auto"> */}
      <Col>
        {/* <Row style={{ justifyContent: "center" }}>{avatar}</Row>
        <Col style={{ marginTop: 24 }}>{children}</Col> */}

        <Skeleton loading={!organization} avatar={{ size: 64 }}>
          <List.Item.Meta
            avatar={
              <OrganizationAvatar organization={organization!} size={64} />
            }
            title={
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {organization?.name}
              </Typography.Title>
            }
            description={
              <>
                {/* <Typography.Text type="secondary">
                  {"Organization short description"}
                </Typography.Text> */}
                <Row gutter={24} style={{ marginLeft: -20 }}>
                  <Col>
                    <Button
                      type="text"
                      size="small"
                      style={{ opacity: 0.7 }}
                      icon={<Icons.TeamOutlined />}
                      onClick={() => alert("switch to members tab")}
                    >
                      {organization?.members.length} members
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      size="small"
                      style={{ opacity: 0.7 }}
                      icon={<Icons.ToolOutlined />}
                      onClick={() => alert("switch to projects tab")}
                    >
                      {organization?.projects.length} projects
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      size="small"
                      style={{ opacity: 0.7 }}
                      icon={<Icons.LinkOutlined />}
                      href="https://fant.io"
                    >
                      https://fant.io
                    </Button>
                  </Col>
                </Row>
              </>
            }
          />
        </Skeleton>
      </Col>

      <Tabs defaultActiveKey="projects" style={{ marginTop: 24 }}>
        <Tabs.TabPane tab="Projects" key="projects">
          {/* <Layout.Content className="max-w-lg mx-auto"> */}
          <Layout.Content>
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
        <Tabs.TabPane tab="About" key="about">
          <Layout.Content className="max-w-lg mx-auto">
            <Typography.Text style={{ textAlign: "center" }}>
              {organization?.description}
            </Typography.Text>
            <OrganizationMemberList organizationId={organizationId} />
          </Layout.Content>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};
