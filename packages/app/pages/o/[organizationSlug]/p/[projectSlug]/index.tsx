import React, { useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { NextPage } from "next";
import { Col, Layout, Tabs, Tooltip } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";
import { useProject } from "@dewo/app/containers/project/hooks";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { ProjectAbout } from "@dewo/app/containers/project/about/ProjectAbout";
import { ProjectTaskList } from "@dewo/app/containers/project/list/ProjectTaskList";
import { Tab } from "@dewo/app/components/Tab";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { ForbiddenResourceModal } from "@dewo/app/components/ForbiddenResourceModal";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectIntegrationType } from "@dewo/app/graphql/types";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = (router.query.tab as string | undefined) ?? "board";

  const canEditProject = usePermission("update", "Project");
  const projectId = useParseIdFromSlug("projectSlug");
  const { project, error } = useProject(projectId);

  const navigateToTab = useCallback(
    (tab: string) => router.push(`${project!.permalink}/${tab}`),
    [project, router]
  );

  const forbiddenError = error?.message === "Forbidden resource";
  const hasDiscordIntegration = useMemo(
    () =>
      !!project?.integrations.some(
        (i) => i.type === ProjectIntegrationType.DISCORD
      ),
    [project]
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
            {canEditProject && !!project && (
              <Tabs.TabPane
                tab={
                  <Tooltip
                    visible={hasDiscordIntegration ? undefined : false}
                    defaultVisible={hasDiscordIntegration}
                    title="Setup Discord"
                    placement="right"
                    overlayInnerStyle={{
                      paddingTop: 4,
                      paddingBottom: 4,
                      minHeight: "unset",
                    }}
                  >
                    <Tab icon={<Icons.SettingOutlined />} children="Settings" />
                  </Tooltip>
                }
                style={{ padding: 12 }}
                key="settings"
                className="max-w-lg mx-auto w-full"
              >
                <ProjectSettings project={project} />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Layout.Content>
      </Layout.Content>
      <ForbiddenResourceModal visible={forbiddenError} />
    </Layout>
  );
};

export default Page;
