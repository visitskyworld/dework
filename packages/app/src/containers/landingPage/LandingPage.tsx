import React, { FC } from "react";
import { PageHeader } from "antd";
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
    <TaskDiscoveryList />
    <TaskUpdateModalListener />
  </>
);
