import React, { useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { NextPage } from "next";
import { Col, Layout, Tabs, Tag } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";
import {
  useProjectDetails,
  useProjectIntegrations,
} from "@dewo/app/containers/project/hooks";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { ProjectAbout } from "@dewo/app/containers/project/about/ProjectAbout";
import { ProjectTaskList } from "@dewo/app/containers/project/list/ProjectTaskList";
import { Tab } from "@dewo/app/components/Tab";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { ForbiddenResourceModal } from "@dewo/app/components/ForbiddenResourceModal";
import { ProjectIntegrationType } from "@dewo/app/graphql/types";
import { TaskFilterProvider } from "@dewo/app/containers/task/board/filters/FilterContext";
import { ProjectTaskFilterButton } from "@dewo/app/containers/task/board/filters/TaskFilterButton";
import { ProjectSeo } from "@dewo/app/containers/seo/ProjectSeo";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = (router.query.tab as string | undefined) ?? "board";

  const projectId = useParseIdFromSlug("projectSlug");
  const organizationId = useParseIdFromSlug("organizationSlug");
  const { project, error } = useProjectDetails(projectId);
  const canEditProject = usePermission("update", project);

  const navigateToTab = useCallback(
    (tab: string) => router.push(`${project!.permalink}/${tab}`),
    [project, router]
  );

  const forbiddenError = error?.message === "Forbidden resource";
  const integrations = useProjectIntegrations(projectId);
  const hasDiscordIntegration = useMemo(
    () =>
      !!integrations?.some((i) => i.type === ProjectIntegrationType.DISCORD),
    [integrations]
  );

  if (!projectId || !organizationId) {
    router.replace("/");
    return null;
  }

  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <ProjectHeader projectId={projectId} organizationId={organizationId} />
        <Layout.Content style={{ flex: 1 }}>
          <TaskFilterProvider>
            <Tabs
              activeKey={currentTab}
              style={{ height: "100%" }}
              className="dewo-tabs"
              tabBarExtraContent={
                ["board", "list"].includes(currentTab) && (
                  <ProjectTaskFilterButton
                    projectId={projectId}
                    style={{ marginLeft: 8, marginRight: 8 }}
                  />
                )
              }
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
                <div style={{ display: "grid", placeItems: "center" }}>
                  <ProjectTaskList projectId={projectId} />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <Tab icon={<Icons.InfoCircleOutlined />} children="About" />
                }
                key="about"
                style={{ padding: "24px 12px" }}
              >
                {!!project && (
                  <Col className="mx-auto max-w-sm w-full">
                    <ProjectAbout project={project} />
                  </Col>
                )}
              </Tabs.TabPane>
              {!!project && canEditProject && (
                <Tabs.TabPane
                  tab={
                    <Tab
                      icon={<Icons.SettingOutlined />}
                      children={
                        <>
                          Settings
                          {!hasDiscordIntegration && (
                            <Tag
                              className="bg-primary"
                              style={{ marginLeft: 8 }}
                            >
                              Setup Discord
                            </Tag>
                          )}
                        </>
                      }
                    />
                  }
                  style={{ padding: 12 }}
                  key="settings"
                  className="max-w-lg mx-auto w-full"
                >
                  <ProjectSettings project={project} />
                </Tabs.TabPane>
              )}
            </Tabs>
          </TaskFilterProvider>
        </Layout.Content>
      </Layout.Content>
      <ForbiddenResourceModal
        visible={forbiddenError}
        projectId={projectId}
        organizationId={organizationId}
      />
      {!!project && <ProjectSeo project={project} />}
    </Layout>
  );
};

export default Page;
