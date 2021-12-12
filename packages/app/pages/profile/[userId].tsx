import React, { useMemo } from "react";
import { NextPage } from "next";
import { Layout, PageHeader } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { UserProfile } from "@dewo/app/containers/user/UserProfile";
import { BreadCrumb } from "@dewo/app/containers/navigation/BreadCrumb";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";

const Page: NextPage = () => {
  let userId = useRouter().query.userId as string;

  const routes = useMemo(
    () =>
      !!userId && [
        {
          path: "../",
          breadcrumbName: "Home",
        },
        {
          path: `/profile/${userId}`,
          breadcrumbName: "My Profile",
        },
      ],
    [userId]
  ) as Route[];

  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <PageHeader
          style={{ marginTop: 40 }}
          breadcrumb={<BreadCrumb routes={routes} />}
        />
        <UserProfile userId={userId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
