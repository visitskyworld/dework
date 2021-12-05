import React, { useCallback } from "react";
import { NextPage } from "next";
import { Layout, Modal } from "antd";
import { Header } from "@dewo/app/containers/navigation/header/Header";
import { useRouter } from "next/router";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { useProject } from "@dewo/app/containers/project/hooks";
import { TaskUpdateModal } from "@dewo/app/containers/task/TaskUpdateModal";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { ProjectProvider } from "@dewo/app/contexts/ProjectContext";

const Page: NextPage = () => {
  const router = useRouter();
  const organizationId = router.query.organizationId as string;
  const projectId = router.query.projectId as string;
  const taskId = router.query.taskId as string;

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
          {!!project && (
            <TaskUpdateModal
              taskId={taskId}
              visible={!!taskId}
              project={project}
              onCancel={navigateToProject}
              onDone={navigateToProject}
            />
          )}
          <Modal
            visible={router.route.endsWith("/settings")}
            title="Project Settings"
            footer={null}
            onCancel={navigateToProject}
          >
            {!!project && <ProjectSettings project={project} />}
          </Modal>
          <ProjectTaskBoard projectId={projectId} />
        </Layout.Content>
      </Layout>
    </ProjectProvider>
  );
};

export default Page;
