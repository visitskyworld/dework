import React, { useCallback } from "react";
import { NextPage } from "next";
import { Layout, Modal } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";
import { useProject } from "@dewo/app/containers/project/hooks";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";

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
    <Layout>
      <Sidebar />
      <Layout.Content>
        <ProjectHeader projectId={projectId} />
        <ProjectTaskBoard projectId={projectId} />
      </Layout.Content>

      <Modal
        visible={router.route.endsWith("/settings")}
        title="Project Settings"
        footer={null}
        onCancel={navigateToProject}
      >
        {!!project && <ProjectSettings project={project} />}
      </Modal>
    </Layout>
  );
};

export default Page;
