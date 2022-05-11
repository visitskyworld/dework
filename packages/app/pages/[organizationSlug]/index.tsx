import React, { useCallback } from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { useRouter } from "next/router";
import { useOrganizationBySlug } from "@dewo/app/containers/organization/hooks";
import { OrganizationTabs } from "@dewo/app/containers/organization/overview/OrganizationTabs";
import { Project } from "@dewo/app/graphql/types";
import { ProjectCreateModal } from "@dewo/app/containers/project/create/ProjectCreateModal";
import { ImportProjectsFromNotionModal } from "@dewo/app/containers/integrations/notion/ImportProjectsFromNotionModal";
import { ImportProjectsFromTrelloModal } from "@dewo/app/containers/integrations/trello/ImportProjectsFromTrelloModal";
import { OrganizationSeo } from "@dewo/app/containers/seo/OrganizationSeo";
import { ImportProjectsFromGithubModal } from "@dewo/app/containers/integrations/github/ImportProjectsFromGithubModal";
import { OrganizationTaskBoard } from "@dewo/app/containers/organization/overview/OrganizationTaskBoard";
import { useIsEmbedded } from "@dewo/app/util/navigation";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = router.pathname.split("/")[2] ?? "overview";
  const isEmbedded = useIsEmbedded() as boolean;
  const importSource = router.query.importSource as string | undefined;
  const settingsTab = router.query.settingsTab as string | undefined;

  const { organizationSlug } = router.query as { organizationSlug: string };
  const { organization } = useOrganizationBySlug(organizationSlug);
  const organizationId = organization?.id;
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
      {!isEmbedded && <Sidebar />}
      <Layout.Content
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {!!organizationId &&
          (isEmbedded ? (
            <OrganizationTaskBoard organizationId={organizationId} />
          ) : (
            <OrganizationTabs
              organizationId={organizationId}
              currentTab={currentTab}
              settingsTab={settingsTab}
            />
          ))}
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
