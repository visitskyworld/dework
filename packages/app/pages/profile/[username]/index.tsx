import React, { useMemo } from "react";
import { NextPage } from "next";
import { Layout, PageHeader } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { UserProfile } from "@dewo/app/containers/user/UserProfile";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "@dewo/app/containers/navigation/PageHeaderBreadcrumbs";
import { useUserByUsername } from "@dewo/app/containers/user/hooks";
import { UserSeo } from "@dewo/app/containers/seo/UserSeo";

const Page: NextPage = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const user = useUserByUsername(username);
  const routes = useMemo(
    () =>
      !!username && [
        {
          path: "../",
          breadcrumbName: "Home",
        },
        {
          path: user ? new URL(user.permalink).pathname : "",
          breadcrumbName: user?.username ?? "Profile",
        },
      ],
    [username, user]
  ) as Route[];

  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <PageHeader breadcrumb={<PageHeaderBreadcrumbs routes={routes} />} />
        {!!user && <UserProfile key={username} userId={user?.id} />}
      </Layout.Content>

      {!!user && <UserSeo user={user} />}
    </Layout>
  );
};

export default Page;
