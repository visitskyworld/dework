import React, { useMemo } from "react";
import { NextPage } from "next";
import { Layout, PageHeader } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "@dewo/app/containers/navigation/PageHeaderBreadcrumbs";
import { UserTaskBoard } from "@dewo/app/containers/user/UserTaskBoard";
import { useUserByUsername } from "@dewo/app/containers/user/hooks";

const Page: NextPage = () => {
  const username = useRouter().query.username as string;
  const user = useUserByUsername(username);
  const routes = useMemo(
    () =>
      !!username && [
        {
          path: "../",
          breadcrumbName: "Home",
        },
        {
          path: user?.permalink,
          breadcrumbName: user?.username ?? "Profile",
        },
        {
          path: "board",
          breadcrumbName: "Task Board",
        },
      ],
    [username, user]
  ) as Route[];

  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <PageHeader breadcrumb={<PageHeaderBreadcrumbs routes={routes} />} />
        <UserTaskBoard userId={user?.id} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
