import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import {
  OrganizationOverview,
  OrganizationOverviewTab,
} from "@dewo/app/containers/organization/overview/OrganizationOverview";
import { OrganizationListSidebar } from "@dewo/app/containers/navigation/OrganizationListSidebar";

const Page: NextPage = () => {
  const organizationId = useRouter().query.organizationId as string;
  const tab = useRouter().query.tab as OrganizationOverviewTab | undefined;
  return (
    <Layout>
      {/* <Header /> */}
      {/* <Layout> */}
      <OrganizationListSidebar />
      <Layout.Content>
        <OrganizationOverview
          tab={tab ?? OrganizationOverviewTab.projects}
          organizationId={organizationId}
        />
      </Layout.Content>
      {/* </Layout> */}
    </Layout>
  );
};

export default Page;
