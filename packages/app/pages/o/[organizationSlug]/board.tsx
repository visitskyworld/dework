import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import {
  OrganizationHeader,
  OrganizationHeaderTab,
} from "@dewo/app/containers/organization/overview/OrganizationHeader";
import { OrganizationTaskBoard } from "@dewo/app/containers/organization/overview/OrganizationTaskBoard";
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
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <OrganizationHeader
          tab={OrganizationHeaderTab.board}
          organizationId={organizationId}
        />
        <Layout.Content style={{ flex: 1 }}>
          <OrganizationTaskBoard organizationId={organizationId} />
        </Layout.Content>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
