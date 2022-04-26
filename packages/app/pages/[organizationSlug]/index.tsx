import React, { useCallback, useMemo } from "react";
import { NextPage } from "next";
import { Grid, Layout, PageHeader, Row } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { useRouter } from "next/router";
import { PageHeaderBreadcrumbs } from "@dewo/app/containers/navigation/PageHeaderBreadcrumbs";
import { useOrganizationBySlug } from "@dewo/app/containers/organization/hooks";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { OrganizationHeaderSummary } from "@dewo/app/containers/organization/overview/OrganizationHeaderSummary";
import { OrganizationTabs } from "@dewo/app/containers/organization/overview/OrganizationTabs";
import { Project } from "@dewo/app/graphql/types";
import { ProjectCreateModal } from "@dewo/app/containers/project/create/ProjectCreateModal";
import { ImportProjectsFromNotionModal } from "@dewo/app/containers/integrations/notion/ImportProjectsFromNotionModal";
import { ImportProjectsFromTrelloModal } from "@dewo/app/containers/integrations/trello/ImportProjectsFromTrelloModal";
import { OrganizationSeo } from "@dewo/app/containers/seo/OrganizationSeo";
import { ImportProjectsFromGithubModal } from "@dewo/app/containers/integrations/github/ImportProjectsFromGithubModal";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = router.pathname.split("/")[2] ?? "overview";
  const importSource = router.query.importSource as string | undefined;
  const settingsTab = router.query.settingsTab as string | undefined;

  const { organizationSlug } = router.query as { organizationSlug: string };
  const { organization } = useOrganizationBySlug(organizationSlug);
  const organizationId = organization?.id;

  const breakpoint = Grid.useBreakpoint();
  const inset = useMemo(() => {
    if (breakpoint.xxl) return 128;
    if (breakpoint.sm) return 16;
    return 8;
  }, [breakpoint]);

  const routes = useMemo(
    () =>
      !!organization && [
        {
          path: "..",
          breadcrumbName: "Home",
        },
        {
          path: new URL(organization.permalink).pathname,
          breadcrumbName: organization.name,
        },
      ],
    [organization]
  ) as Route[];

  const navigateToProject = useCallback(
    (project: Project) => router.push(project.permalink),
    [router]
  );

  if (!organizationSlug) {
    router.replace("/");
    return null;
  }

  return (
    <Layout>
      <Sidebar />
      <Layout.Content>
        <PageHeader breadcrumb={<PageHeaderBreadcrumbs routes={routes} />} />
        <Row style={{ marginLeft: inset, marginRight: inset }}>
          <OrganizationHeaderSummary organizationId={organizationId} />
        </Row>
        {!!organizationId && (
          <OrganizationTabs
            tabBarStyle={{ paddingLeft: inset, paddingRight: inset }}
            tabPaneStyle={{ padding: `12px ${inset}px` }}
            organizationId={organizationId}
            currentTab={currentTab}
            settingsTab={settingsTab}
          />
        )}
      </Layout.Content>

      {!!organizationId && (
        <>
          <ProjectCreateModal
            visible={router.route.endsWith("/create")}
            organizationId={organizationId}
            onCreated={navigateToProject}
            onCancel={router.back}
          />
          {!!router.query.threepidId && importSource === "notion" && (
            <ImportProjectsFromNotionModal
              visible
              organizationId={organizationId}
              threepidId={router.query.threepidId as string}
            />
          )}
          {!!router.query.threepidId && importSource === "trello" && (
            <ImportProjectsFromTrelloModal
              visible
              organizationId={organizationId}
              threepidId={router.query.threepidId as string}
            />
          )}
          {importSource === "github" && (
            <ImportProjectsFromGithubModal
              visible
              organizationId={organizationId}
            />
          )}
        </>
      )}

      {!!organization && <OrganizationSeo organization={organization} />}
    </Layout>
  );
};

export default Page;
