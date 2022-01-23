import React, { useCallback, useMemo } from "react";
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
import { Project } from "@dewo/app/graphql/types";
import { ProjectCreateModal } from "@dewo/app/containers/project/create/ProjectCreateModal";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = (router.query.tab as string | undefined) ?? "overview";
  const settingsTab = router.query.settingsTab as string | undefined;
  const organizationId = useParseIdFromSlug("organizationSlug");
  const { organization } = useOrganization(organizationId);
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

  const navigateToProject = useCallback(
    (project: Project) => router.push(project.permalink),
    [router]
  );

  if (!organizationId) {
    router.replace("/");
    return null;
  }

  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <PageHeader breadcrumb={<PageHeaderBreadcrumbs routes={routes} />} />
        <Row style={{ marginLeft: 24, marginRight: 24 }}>
          <Row className="max-w-lg mx-auto w-full">
            <OrganizationHeaderSummary organizationId={organizationId} />
          </Row>
        </Row>
        <OrganizationTabs
          organizationId={organizationId}
          currentTab={currentTab}
          settingsTab={settingsTab}
        />
      </Layout.Content>

      <ProjectCreateModal
        visible={router.route.endsWith("/create")}
        organizationId={organizationId}
        onCreated={navigateToProject}
        onCancel={router.back}
      />
    </Layout>
  );
};

export default Page;
