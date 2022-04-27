import React, { FC } from "react";
import { PageHeader, Tabs } from "antd";
import { PageHeaderBreadcrumbs } from "../navigation/PageHeaderBreadcrumbs";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";
import { ProjectDiscoveryList } from "../discovery/ProjectDiscoveryList";
import styles from "./LandingPage.module.less";
import { TaskDiscoveryList } from "../discovery/TaskDiscoveryList";

export const LandingPage: FC = () => (
  <>
    <PageHeader
      className="bg-body-secondary"
      breadcrumb={
        <PageHeaderBreadcrumbs
          routes={[{ path: "/", breadcrumbName: "Home" }]}
        />
      }
    />
    <Tabs centered className={styles.tabs}>
      <Tabs.TabPane tab="🌍 Popular DAOs" key="projects">
        <ProjectDiscoveryList />
      </Tabs.TabPane>
      <Tabs.TabPane tab="🔥 Open Bounties" key="bounties">
        <TaskDiscoveryList />
      </Tabs.TabPane>
    </Tabs>
    <TaskUpdateModalListener />
  </>
);
