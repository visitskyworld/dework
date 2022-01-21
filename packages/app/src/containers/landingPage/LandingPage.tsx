import React, { FC } from "react";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { PageHeader } from "antd";
import { LoginButton } from "../auth/LoginButton";
import { ExplorePopularDaosSection } from "./ExplorePopularDaosSection";
import { LandingPageFooter } from "./Footer";
import { ProductSection } from "./ProductSection";
import { UserTaskBoard } from "../user/UserTaskBoard";
import { PageHeaderBreadcrumbs } from "../navigation/PageHeaderBreadcrumbs";
import { Logo } from "@dewo/app/components/Logo";

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
