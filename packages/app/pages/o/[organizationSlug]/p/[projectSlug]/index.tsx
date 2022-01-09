import React, { useCallback } from "react";
import * as Icons from "@ant-design/icons";
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
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Tab } from "@dewo/app/components/Tab";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = (router.query.tab as string | undefined) ?? "board";
  const canUpdateProject = usePermission("update", "Project");

  const projectId = useParseIdFromSlug("projectSlug");
  const project = useProject(projectId);

  const navigateToProject = useCallback(
    () => router.push(project?.permalink!),
    [router, project?.permalink]
  );

  const navigateToTab = useCallback(
    (tab: string) => router.push(`${project!.permalink}/${tab}`),
    [project, router]
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
            activeKey={currentTab}
            tabBarStyle={{ paddingLeft: 24, paddingRight: 24 }}
            onTabClick={navigateToTab}
          >
            <Tabs.TabPane
              tab={<Tab icon={<Icons.ProjectOutlined />} children="Board" />}
              key="board"
            >
              <ProjectTaskBoard projectId={projectId} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<Tab icon={<Icons.BarsOutlined />} children="List" />}
              key="list"
            >
              <ProjectTaskList projectId={projectId} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<Tab icon={<Icons.InfoCircleOutlined />} children="About" />}
              key="about"
              style={{ paddingLeft: 24, paddingRight: 24, maxWidth: 480 }}
            >
              {!!project && <ProjectAbout project={project} />}
            </Tabs.TabPane>
            {canUpdateProject && (
              <Tabs.TabPane
                tab={
                  <Tab icon={<Icons.SettingOutlined />} children="Settings" />
                }
                key="settings"
              />
            )}
          </Tabs>
        </Layout.Content>
      </Layout.Content>

      <Modal
        visible={currentTab === "settings"}
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
