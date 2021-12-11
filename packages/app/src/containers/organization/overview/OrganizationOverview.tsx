import { Col, Layout, Menu, Row, Typography } from "antd";
import React, { FC, useMemo } from "react";
import { useOrganization } from "../hooks";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectCard } from "./CreateProjectCard";
import { OrganizationTaskBoard } from "./OrganizationTaskBoard";
import { OrganizationMemberList } from "./OrganizationMemberList";
import Link from "next/link";

export enum OrganizationOverviewTab {
  projects = "projects",
  board = "board",
  members = "members",
}

const titleByTab: Record<OrganizationOverviewTab, string> = {
  [OrganizationOverviewTab.projects]: "Projects",
  [OrganizationOverviewTab.board]: "Board",
  [OrganizationOverviewTab.members]: "Members",
};

interface OrganizationOverviewProps {
  organizationId: string;
  tab: OrganizationOverviewTab;
}

export const OrganizationOverview: FC<OrganizationOverviewProps> = ({
  organizationId,
  tab,
}) => {
  const organization = useOrganization(organizationId);
  const content = useMemo(() => {
    switch (tab) {
      case OrganizationOverviewTab.members:
        return (
          <Layout.Content className="max-w-lg">
            <OrganizationMemberList organizationId={organizationId} />
          </Layout.Content>
        );
      case OrganizationOverviewTab.board:
        return <OrganizationTaskBoard organizationId={organizationId} />;
      case OrganizationOverviewTab.projects:
      default:
        return (
          <Layout.Content className="max-w-lg">
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
        );
    }
  }, [tab, organizationId, organization]);

  return (
    <Layout>
      <Layout.Header>
        <Row align="middle">
          <Col>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {organization?.name}
            </Typography.Title>
          </Col>

          <Col style={{ flex: 1, marginLeft: 24 }}>
            <Menu mode="horizontal" selectedKeys={[tab]}>
              {[
                OrganizationOverviewTab.projects,
                OrganizationOverviewTab.board,
                OrganizationOverviewTab.members,
              ].map((tab) => (
                <Menu.Item key={tab}>
                  <Link href={`/organization/${organizationId}/${tab}`}>
                    <a>{titleByTab[tab]}</a>
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          </Col>
        </Row>
      </Layout.Header>
      <Layout.Content style={{ marginTop: 24 }}>{content}</Layout.Content>
    </Layout>
  );
};
