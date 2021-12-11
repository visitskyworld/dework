import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { useRouter } from "next/router";
import { OrganizationOverview } from "@dewo/app/containers/organization/overview/OrganizationOverview";
import { SidebardOrganizationList } from "@dewo/app/containers/navigation/SidebardOrganizationList";

const Page: NextPage = () => {
  const organizationId = useRouter().query.organizationId as string;
  return (
    <Layout>
      <Header />
      <Layout>
        <Layout.Sider>
          <SidebardOrganizationList />
        </Layout.Sider>
        <Layout.Content>
          <OrganizationOverview organizationId={organizationId} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Page;
