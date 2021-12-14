import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import {
  OrganizationHeader,
  OrganizationHeaderTab,
} from "@dewo/app/containers/organization/overview/OrganizationHeader";
import { OrganizationMemberList } from "@dewo/app/containers/organization/overview/OrganizationMemberList";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const router = useRouter();
  const organizationId = useParseIdFromSlug("organizationSlug");
  if (!organizationId) {
    router.replace("/");
    return null;
  }
  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <OrganizationHeader
          tab={OrganizationHeaderTab.members}
          organizationId={organizationId}
        />
        <Layout.Content className="max-w-sm">
          <OrganizationMemberList organizationId={organizationId} />
        </Layout.Content>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
