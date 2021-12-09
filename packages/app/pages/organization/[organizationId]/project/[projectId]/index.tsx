import React, { useCallback } from "react";
import { NextPage } from "next";
import { Layout, Modal } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { useRouter } from "next/router";
import { useProject } from "@dewo/app/containers/project/hooks";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { ProjectProvider } from "@dewo/app/contexts/ProjectContext";
import { ProjectOverview } from "@dewo/app/containers/project/overview/ProjectOverview";

const Page: NextPage = () => {
  const router = useRouter();
  const organizationId = router.query.organizationId as string;
  const projectId = router.query.projectId as string;

  const navigateToProject = useCallback(
    () => router.push(`/organization/${organizationId}/project/${projectId}`),
    [router, organizationId, projectId]
  );

  const project = useProject(projectId);
  return (
    <ProjectProvider id={projectId}>
      <Layout>
        <Header />
        <Layout.Content>
          <Modal
            visible={router.route.endsWith("/settings")}
            title="Project Settings"
            footer={null}
            onCancel={navigateToProject}
          >
            {!!project && <ProjectSettings project={project} />}
          </Modal>
          <ProjectOverview projectId={projectId} />
        </Layout.Content>
      </Layout>
    </ProjectProvider>
  );
};

export default Page;
