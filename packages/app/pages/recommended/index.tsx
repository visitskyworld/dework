import React, { useMemo } from "react";
import { NextPage } from "next";
import { Layout, PageHeader, Typography } from "antd";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { RecommendedDAOsList } from "@dewo/app/containers/discovery/RecommendedDAOsList";
import { PageHeaderBreadcrumbs } from "@dewo/app/containers/navigation/PageHeaderBreadcrumbs";
import { ThreepidAuthButton } from "@dewo/app/containers/auth/buttons/ThreepidAuthButton";
import { ThreepidSource } from "@dewo/app/graphql/types";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

const Page: NextPage = () => {
  const routes = useMemo<Route[]>(
    () => [
      { path: "../", breadcrumbName: "Home" },
      { path: "..", breadcrumbName: "Recommended DAOs" },
    ],
    []
  ) as Route[];

  const { user } = useAuthContext();
  const isConnectedToDiscord = useMemo(
    () => !!user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user]
  );

  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ paddingBottom: 40, textAlign: "center" }}>
        <PageHeader
          breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
          style={{ paddingBottom: 40 }}
        />
        {isConnectedToDiscord ? (
          <RecommendedDAOsList />
        ) : (
          <>
            <Typography.Title level={3}>Recommended DAOs</Typography.Title>
            <Typography.Paragraph type="secondary" style={{ padding: 16 }}>
              Link your Discord account to see a list of DAOs recommended for
              you
            </Typography.Paragraph>
            <ThreepidAuthButton
              source={ThreepidSource.discord}
              children="Connect Discord"
              type="primary"
              size="large"
            />
          </>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default Page;
