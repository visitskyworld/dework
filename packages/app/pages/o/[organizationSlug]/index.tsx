import React, { useMemo } from "react";
import { NextPage } from "next";
import { Layout, PageHeader, Row } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { useRouter } from "next/router";
import { PageHeaderBreadcrumbs } from "@dewo/app/containers/navigation/PageHeaderBreadcrumbs";
import { useOrganization } from "@dewo/app/containers/organization/hooks";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { OrganizationHeaderSummary } from "@dewo/app/containers/organization/overview/OrganizationHeaderSummary";
import { OrganizationTabs } from "@dewo/app/containers/organization/overview/OrganizationTabs";

const Page: NextPage = () => {
  const router = useRouter();
  const organizationTab =
    (router.query.tab as string | undefined) ?? "overview";
  const organizationId = useParseIdFromSlug("organizationSlug");
  const organization = useOrganization(organizationId);
  const routes = useMemo(
    () =>
      !!organization && [
        {
          path: "..",
          breadcrumbName: "Home",
        },
        {
          path: `o/${organization.slug}`,
          breadcrumbName: organization.name,
        },
      ],
    [organization]
  ) as Route[];

  if (!organizationId) {
    router.replace("/");
    return null;
  }

  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <PageHeader breadcrumb={<PageHeaderBreadcrumbs routes={routes} />} />
        <Row className="max-w-lg mx-auto w-full">
          <OrganizationHeaderSummary organizationId={organizationId} />
        </Row>
        <OrganizationTabs
          organizationId={organizationId}
          activeKey={organizationTab}
        />
      </Layout.Content>
    </Layout>
  );
};

export default Page;
