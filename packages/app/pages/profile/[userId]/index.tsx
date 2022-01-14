import React, { useMemo } from "react";
import { NextPage } from "next";
import { Layout, PageHeader } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { UserProfile } from "@dewo/app/containers/user/UserProfile";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "@dewo/app/containers/navigation/PageHeaderBreadcrumbs";
import { useUser } from "@dewo/app/containers/user/hooks";

const Page: NextPage = () => {
  const userId = useRouter().query.userId as string;
  const user = useUser(userId);
  const routes = useMemo(
    () =>
      !!userId && [
        {
          path: "../",
          breadcrumbName: "Home",
        },
        {
          path: `/profile/${userId}`,
          breadcrumbName: user?.username ?? "Profile",
        },
      ],
    [userId, user]
  ) as Route[];

  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <PageHeader breadcrumb={<PageHeaderBreadcrumbs routes={routes} />} />
        <UserProfile key={userId} userId={userId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
