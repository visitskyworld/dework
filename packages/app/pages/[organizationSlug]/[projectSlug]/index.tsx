import React, { useCallback, useEffect } from "react";
import * as Icons from "@ant-design/icons";
import { NextPage } from "next";
import { Col, Layout, Tabs } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectTaskBoard } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";
import {
  useProjectBySlug,
  useProjectDetails,
} from "@dewo/app/containers/project/hooks";
import { ProjectAbout } from "@dewo/app/containers/project/about/ProjectAbout";
import { ProjectTaskList } from "@dewo/app/containers/project/list/ProjectTaskList";
import { Tab } from "@dewo/app/components/Tab";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { ForbiddenResourceModal } from "@dewo/app/components/ForbiddenResourceModal";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskFilterProvider } from "@dewo/app/containers/task/board/filters/FilterContext";
import { ProjectTaskFilterButton } from "@dewo/app/containers/task/board/filters/TaskFilterButton";
import { ProjectSeo } from "@dewo/app/containers/seo/ProjectSeo";
import { useOrganizationBySlug } from "@dewo/app/containers/organization/hooks";
import { CommunitySuggestions } from "@dewo/app/containers/project/community/CommunitySuggestions";
import { TaskCreateModal } from "@dewo/app/containers/task/TaskCreateModal";
import { TaskStatus } from "@dewo/app/graphql/types";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = (router.query.tab as string | undefined) ?? "board";

  const { organizationSlug, projectSlug } = router.query as {
    organizationSlug: string;
    projectSlug: string;
  };
  const { organization } = useOrganizationBySlug(organizationSlug);
  const { project, error } = useProjectBySlug(projectSlug);
  const canEditProject = usePermission("update", project);
  const details = useProjectDetails(project?.id).project;
  const organizationId = organization?.id;

  const navigateToTab = useCallback(
    (tab: string) => router.push(`${project!.permalink}/${tab}`),
    [project, router]
  );

  const forbiddenError = error?.message === "Forbidden resource";

  useEffect(() => {
    if (!projectSlug || !organizationSlug) {
      router.replace("/");
    }
  }, [router, projectSlug, organizationSlug]);

  if (!projectSlug || !organizationSlug) {
    return null;
  }

  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        <ProjectHeader
          projectId={project?.id}
          organizationId={organizationId}
        />
        <Layout.Content style={{ flex: 1 }}>
          <TaskFilterProvider>
            <Tabs
              activeKey={currentTab}
              style={{ height: "100%" }}
              className="dewo-tabs"
              tabBarExtraContent={
                ["board", "list"].includes(currentTab) && (
                  <ProjectTaskFilterButton
                    projectId={project?.id}
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
                <ProjectTaskBoard projectId={project?.id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={<Tab icon={<Icons.BarsOutlined />} children="List" />}
                key="list"
                style={{ overflowX: "auto", padding: 12 }}
              >
                <div style={{ display: "grid", placeItems: "center" }}>
                  <ProjectTaskList projectId={project?.id} />
                </div>
              </Tabs.TabPane>
              {!!project && !!details?.options?.showBacklogColumn && (
                <Tabs.TabPane
                  tab={
                    <Tab
                      icon={<Icons.UsergroupAddOutlined />}
                      children="Community Suggestions"
                    />
                  }
                  key="community"
                >
                  <CommunitySuggestions projectId={project.id} />
                </Tabs.TabPane>
              )}
              <Tabs.TabPane
                tab={
                  <Tab icon={<Icons.InfoCircleOutlined />} children="About" />
                }
                key="about"
                style={{ padding: "24px 12px" }}
              >
                {!!details && (
                  <Col className="mx-auto max-w-sm w-full">
                    <ProjectAbout project={details} />
                  </Col>
                )}
              </Tabs.TabPane>
              {!!details && canEditProject && (
                <Tabs.TabPane
                  tab={
                    <Tab icon={<Icons.SettingOutlined />} children="Settings" />
                  }
                  style={{ padding: 12 }}
                  key="settings"
                  className="max-w-lg mx-auto w-full"
                >
                  <ProjectSettings project={details} />
                </Tabs.TabPane>
              )}
            </Tabs>
          </TaskFilterProvider>
        </Layout.Content>
      </Layout.Content>
      <ForbiddenResourceModal
        visible={forbiddenError}
        projectId={project?.id}
        organizationId={organizationId}
      />
      {!!details && <ProjectSeo project={details} />}
      {!!project && (
        <TaskCreateModal
          projectId={project.id}
          initialValues={Object.assign(
            { status: TaskStatus.TODO },
            router.query
          )}
          visible={router.route.endsWith("/create")}
          onDone={() => router.push(project.permalink)}
          onCancel={() => router.push(project.permalink)}
        />
      )}
    </Layout>
  );
};

export default Page;
