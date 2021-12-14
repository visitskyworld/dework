import React from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import {
  OrganizationHeader,
  OrganizationHeaderTab,
} from "@dewo/app/containers/organization/overview/OrganizationHeader";
import { OrganizationProjectList } from "@dewo/app/containers/organization/overview/OrganizationProjectList";
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
          tab={OrganizationHeaderTab.projects}
          organizationId={organizationId}
        />
        <OrganizationProjectList organizationId={organizationId} />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
