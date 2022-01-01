import React, { useMemo } from "react";
import { NextPage } from "next";
import * as Icons from "@ant-design/icons";
import {
  Avatar,
  Col,
  Divider,
  Layout,
  List,
  PageHeader,
  Row,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import {
  OrganizationHeader,
  OrganizationHeaderTab,
} from "@dewo/app/containers/organization/overview/OrganizationHeader";
import { OrganizationProjectList } from "@dewo/app/containers/organization/overview/OrganizationProjectList";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { useRouter } from "next/router";
import { UserDetails } from "@dewo/app/containers/user/UserDetails";
import { UserDetailType } from "@dewo/app/graphql/types";
import { PageHeaderBreadcrumbs } from "@dewo/app/containers/navigation/PageHeaderBreadcrumbs";
import { useOrganization } from "@dewo/app/containers/organization/hooks";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { InviteButton } from "@dewo/app/containers/invite/InviteButton";

const Page: NextPage = () => {
  const router = useRouter();
  const organizationId = useParseIdFromSlug("organizationSlug");
  const organization = useOrganization(organizationId);
  const routes = useMemo(
    () =>
      !!organization && [
        {
          path: "..",
          breadcrumbName: (
            <>
              <Icons.HomeOutlined />
              <span>Home</span>
            </>
          ),
        },
        {
          path: `o/${organization.slug}`,
          breadcrumbName: organization.name,
        },
      ],
    [organization]
  ) as Route[];

  if (!organizationId) {
    router.replace("/");
    return null;
  }

  if (!!organization && Math.random()) {
    return (
      <Layout>
        <Sidebar />
        <Layout.Content>
          <PageHeader breadcrumb={<PageHeaderBreadcrumbs routes={routes} />} />
          <Row className="max-w-lg mx-auto w-full">
            <List.Item.Meta
              avatar={
                <OrganizationAvatar organization={organization} size={96} />
              }
              title={
                <Typography.Title level={3} style={{ marginBottom: 0 }}>
                  {organization.name}
                </Typography.Title>
              }
              description={
                <>
                  <Typography.Paragraph
                    type="secondary"
                    style={{ marginBottom: 8, maxWidth: 480 }}
                    ellipsis={{ rows: 2 }}
                  >
                    {organization.description}
                  </Typography.Paragraph>
                  <UserDetails
                    isEditMode={false}
                    userDetails={[
                      {
                        __typename: "UserDetail",
                        id: "1",
                        type: UserDetailType.website,
                        value: "https://www.citydao.io",
                      },
                      {
                        __typename: "UserDetail",
                        id: "1",
                        type: UserDetailType.github,
                        value: "https://github.com/deworkxyz",
                      },
                    ]}
                  />
                </>
              }
            />
          </Row>
          <Tabs centered style={{ marginTop: 16 }}>
            <Tabs.TabPane
              tab={
                <>
                  <Icons.HomeOutlined />
                  Overview
                </>
              }
              key="overview"
              className="max-w-lg mx-auto w-full"
            >
              <Row gutter={48}>
                <Col span={18} className="dewo-divider-right">
                  {/* <Typography.Title level={5}>Intro</Typography.Title>
                  <Typography.Paragraph type="secondary">
                    {organization.description}
                  </Typography.Paragraph> */}

                  <Typography.Title level={5}>Projects</Typography.Title>
                  <OrganizationProjectList organizationId={organizationId} />
                </Col>
                <Col span={6}>
                  <Typography.Title level={5}>Intro</Typography.Title>
                  <Typography.Paragraph
                    type="secondary"
                    style={{ marginBottom: 8, maxWidth: 480 }}
                    ellipsis={{ rows: 6 }}
                  >
                    {organization.description}
                  </Typography.Paragraph>
                  <UserDetails
                    isEditMode={false}
                    userDetails={[
                      {
                        __typename: "UserDetail",
                        id: "1",
                        type: UserDetailType.website,
                        value: "https://www.citydao.io",
                      },
                      {
                        __typename: "UserDetail",
                        id: "1",
                        type: UserDetailType.github,
                        value: "https://github.com/deworkxyz",
                      },
                    ]}
                  />

                  <Divider />

                  <Typography.Title level={5}>Contributors</Typography.Title>
                  <Row>
                    <Avatar.Group maxCount={3} size="large">
                      {organization.members.map((m) => (
                        <UserAvatar key={m.id} user={m.user} linkToProfile />
                      ))}
                    </Avatar.Group>
                  </Row>
                  <InviteButton
                    organizationId={organizationId}
                    style={{ marginTop: 16 }}
                  />

                  <Divider />
                  <Typography.Title level={5}>Tags</Typography.Title>
                  <Row>
                    <Tag color="green">Add some useful tags here</Tag>
                  </Row>
                </Col>
                {/* <Card size="small">here is projects</Card> */}
              </Row>
            </Tabs.TabPane>
            {/* <Tabs.TabPane
              tab={
                <>
                  <Icons.InfoCircleOutlined />
                  About
                </>
              }
              key="about"
            >
              bao
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <Icons.ProjectOutlined />
                  Projects
                </>
              }
              key="projects"
            >
              bao
            </Tabs.TabPane> */}
            <Tabs.TabPane
              tab={
                <>
                  <Icons.TeamOutlined />
                  Contributors
                </>
              }
              key="contributors"
            >
              bao
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <Icons.ProjectOutlined />
                  Board
                </>
              }
              key="board"
            >
              bao
            </Tabs.TabPane>
            {/* <Tabs.TabPane
              tab={
                <>
                  <Icons.SettingOutlined />
                  Settings
                </>
              }
              key="settings"
            >
              bao
            </Tabs.TabPane> */}
          </Tabs>
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <OrganizationHeader
          tab={OrganizationHeaderTab.projects}
          organizationId={organizationId}
        />
        <div style={{ padding: "0 24px", marginBottom: 24, maxWidth: 480 }}>
          {/* <Card
          style={{
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 16,
            maxWidth: 400,
          }}
        > */}
          {/* <Typography.Paragraph type="secondary" style={{ marginBottom: 4 }}>
            maskldmaskdl amskldamd klasmklasmkd lam kdl
          </Typography.Paragraph> */}

          {/* <Typography.Title level={5}>About</Typography.Title> */}

          {/* {!!MDEditor && (
            <MDEditor
              value="CityDAO is building a network of assets on chain, starting with a single parcel of land in Wyoming. Each parcel of land is an NFT that can be owned collectively by the DAO collectively or by individuals. It is a DAO, or Decentralized Autonomous Organization, meaning it is managed by the community."
              hideToolbar
              enableScroll={false}
              previewOptions={{ linkTarget: "_blank" }}
              className="dewo-md-editor"
              preview="preview"
              style={{ marginBottom: 8 }}
            />
          )} */}

          <UserDetails
            isEditMode={false}
            userDetails={[
              {
                __typename: "UserDetail",
                id: "1",
                type: UserDetailType.website,
                value: "https://www.citydao.io",
              },
              {
                __typename: "UserDetail",
                id: "1",
                type: UserDetailType.github,
                value: "https://github.com/deworkxyz",
              },
            ]}
          />
        </div>
        {/* </Card> */}
        <OrganizationProjectList organizationId={organizationId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
