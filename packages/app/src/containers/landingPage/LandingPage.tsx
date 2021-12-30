import React, { FC } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { PageHeader, Row, Typography } from "antd";
import { siteTitle } from "@dewo/app/util/constants";
import { DeworkIcon } from "@dewo/app/components/icons/Dework";
import { LoginButton } from "../auth/LoginButton";
import { ExplorePopularDaosSection } from "./ExplorePopularDaosSection";
import { LandingPageFooter } from "./Footer";
import { ProductSection } from "./ProductSection";
import { UserTaskBoard } from "../user/UserTaskBoard";
import { PageHeaderBreadcrumbs } from "../navigation/PageHeaderBreadcrumbs";

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
        <UserTaskBoard userId={user.id} />
      </>
    );
  }
  return (
    <>
      <PageHeader
        title={
          <Row align="middle">
            <DeworkIcon style={{ width: 24, height: 24, marginRight: 8 }} />
            <Typography.Title level={4} style={{ margin: 0 }}>
              {siteTitle}
            </Typography.Title>
          </Row>
        }
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
