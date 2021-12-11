import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import {
  OrganizationHeader,
  OrganizationHeaderTab,
} from "@dewo/app/containers/organization/overview/OrganizationHeader";
import { OrganizationMemberList } from "@dewo/app/containers/organization/overview/OrganizationMemberList";

const Page: NextPage = () => {
  const organizationId = useRouter().query.organizationId as string;
  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <OrganizationHeader
          tab={OrganizationHeaderTab.members}
          organizationId={organizationId}
        />
        <Layout.Content className="max-w-lg">
          <OrganizationMemberList organizationId={organizationId} />
        </Layout.Content>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
