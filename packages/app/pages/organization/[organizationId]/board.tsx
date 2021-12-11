import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import {
  OrganizationHeader,
  OrganizationHeaderTab,
} from "@dewo/app/containers/organization/overview/OrganizationHeader";
import { OrganizationTaskBoard } from "@dewo/app/containers/organization/overview/OrganizationTaskBoard";

const Page: NextPage = () => {
  const organizationId = useRouter().query.organizationId as string;
  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <OrganizationHeader
          tab={OrganizationHeaderTab.board}
          organizationId={organizationId}
        />
        <OrganizationTaskBoard organizationId={organizationId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
