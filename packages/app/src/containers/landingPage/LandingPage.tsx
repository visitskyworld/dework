import React, { FC } from "react";
import { PageHeader, Typography } from "antd";
import { PageHeaderBreadcrumbs } from "../navigation/PageHeaderBreadcrumbs";
import { TaskDiscoveryList } from "../discovery/TaskDiscoveryList";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";

export const LandingPage: FC = () => (
  <>
    <PageHeader
      breadcrumb={
        <PageHeaderBreadcrumbs
          routes={[{ path: "/", breadcrumbName: "Home" }]}
        />
      }
    />
    <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
      🔥 Latest Tasks
    </Typography.Title>
    <TaskDiscoveryList />
    <TaskUpdateModalListener />
  </>
);
