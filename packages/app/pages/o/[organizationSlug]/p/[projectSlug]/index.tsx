import React, { useCallback } from "react";
import { NextPage } from "next";
import { Layout, Modal, Tabs } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";
import { useProject } from "@dewo/app/containers/project/hooks";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { ProjectAbout } from "@dewo/app/containers/project/about/ProjectAbout";
import { ProjectTaskList } from "@dewo/app/containers/project/list/ProjectTaskList";

const Page: NextPage = () => {
  const router = useRouter();
  const projectId = useParseIdFromSlug("projectSlug");
  const project = useProject(projectId);
  const navigateToProject = useCallback(
    () => router.push(project?.permalink!),
    [router, project?.permalink]
  );

  if (!projectId) {
    router.replace("/");
    return null;
  }

  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <ProjectHeader projectId={projectId} />
        <Layout.Content style={{ flex: 1 }}>
          <Tabs
            defaultActiveKey="list"
            tabBarStyle={{ paddingLeft: 24, paddingRight: 24 }}
          >
            <Tabs.TabPane tab="Board" key="board">
              <ProjectTaskBoard projectId={projectId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="List" key="list">
              <ProjectTaskList projectId={projectId} />
            </Tabs.TabPane>
          </Tabs>
        </Layout.Content>
      </Layout.Content>

      <Modal
        visible={router.route.endsWith("/settings")}
        title="Project Settings"
        footer={null}
        onCancel={navigateToProject}
      >
        {!!project && <ProjectSettings project={project} />}
      </Modal>
      <Modal
        visible={router.route.endsWith("/about")}
        title="About"
        footer={null}
        onCancel={navigateToProject}
      >
        {!!project && <ProjectAbout project={project} />}
      </Modal>
    </Layout>
  );
};

export default Page;
