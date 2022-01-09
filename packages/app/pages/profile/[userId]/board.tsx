import React, { useMemo } from "react";
import { NextPage } from "next";
import { Layout, PageHeader } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "@dewo/app/containers/navigation/PageHeaderBreadcrumbs";
import { UserTaskBoard } from "@dewo/app/containers/user/UserTaskBoard";
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
        {
          path: "board",
          breadcrumbName: "Task Board",
        },
      ],
    [userId, user]
  ) as Route[];

  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <PageHeader breadcrumb={<PageHeaderBreadcrumbs routes={routes} />} />
        <UserTaskBoard userId={userId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
