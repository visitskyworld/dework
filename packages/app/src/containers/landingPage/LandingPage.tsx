import React, { FC } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { PageHeader, Typography } from "antd";
import { LoginButton } from "../auth/LoginButton";
import { ExplorePopularDaosSection } from "./ExplorePopularDaosSection";
import { LandingPageFooter } from "./Footer";
import { ProductSection } from "./ProductSection";
import { PageHeaderBreadcrumbs } from "../navigation/PageHeaderBreadcrumbs";
import { Logo } from "@dewo/app/components/Logo";
import { TaskDiscoveryList } from "../discovery/TaskDiscoveryList";
import { TaskUpdateModalListener } from "../task/TaskUpdateModal";

export const LandingPage: FC = () => {
  const { user } = useAuthContext();
  if (!!user) {
    return (
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
  }
  return (
    <>
      <PageHeader
        title={<Logo />}
        extra={[
          !user && (
            <LoginButton key="get-started" type="primary">
              Connect
            </LoginButton>
          ),
        ]}
        style={{ width: "100%" }}
        className="max-w-xl mx-auto"
      />
      <ProductSection />
      <ExplorePopularDaosSection />
      <LandingPageFooter />
    </>
  );
};
