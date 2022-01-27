import React, { useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { NextPage } from "next";
import { Col, Layout, Modal, Tabs } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";
import { useProject } from "@dewo/app/containers/project/hooks";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { ProjectAbout } from "@dewo/app/containers/project/about/ProjectAbout";
import { ProjectTaskList } from "@dewo/app/containers/project/list/ProjectTaskList";
import { Tab } from "@dewo/app/components/Tab";
import { ForbiddenResourceModal } from "@dewo/app/components/ForbiddenResourceModal";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = (router.query.tab as string | undefined) ?? "board";

  const projectId = useParseIdFromSlug("projectSlug");
  const { project, error } = useProject(projectId);

  const navigateToProject = useCallback(
    () => router.push(project?.permalink!),
    [router, project?.permalink]
  );

  const navigateToTab = useCallback(
    (tab: string) => router.push(`${project!.permalink}/${tab}`),
    [project, router]
  );

  const forbiddenError = error?.message === "Forbidden resource";

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
            style={{ height: "100%" }}
            className="dewo-tabs"
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
              style={{ overflowX: "auto", padding: 12 }}
            >
              <ProjectTaskList projectId={projectId} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<Tab icon={<Icons.InfoCircleOutlined />} children="About" />}
              key="about"
              style={{ padding: "24px 12px" }}
            >
              {!!project && (
                <Col className="mx-auto max-w-sm w-full">
                  <ProjectAbout project={project} />
                </Col>
              )}
            </Tabs.TabPane>
          </Tabs>
        </Layout.Content>
      </Layout.Content>

      <Modal
        visible={!!project && router.route.endsWith("/settings")}
        title="Project Settings"
        footer={null}
        onCancel={navigateToProject}
      >
        {!!project && <ProjectSettings project={project} />}
      </Modal>
      <ForbiddenResourceModal visible={forbiddenError} />
    </Layout>
  );
};

export default Page;
