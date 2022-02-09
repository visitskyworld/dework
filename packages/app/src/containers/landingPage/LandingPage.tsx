import React, { FC } from "react";
import { PageHeader, Tabs } from "antd";
import { PageHeaderBreadcrumbs } from "../navigation/PageHeaderBreadcrumbs";
// import { TaskDiscoveryList } from "../discovery/TaskDiscoveryList";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { ProjectDiscoveryList } from "../discovery/ProjectDiscoveryList";
import { TaskDiscoveryList } from "../discovery/TaskDiscoveryList";

export const LandingPage: FC = () => (
  <>
    <PageHeader
      breadcrumb={
        <PageHeaderBreadcrumbs
          routes={[{ path: "/", breadcrumbName: "Home" }]}
        />
      }
    />
    <Tabs centered tabBarStyle={{ marginBottom: 40 }}>
      <Tabs.TabPane tab="Popular Projects" key="projects">
        <ProjectDiscoveryList />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Open Bounties" key="bounties">
        <TaskDiscoveryList />
      </Tabs.TabPane>
    </Tabs>
    <TaskUpdateModalListener />
  </>
);
