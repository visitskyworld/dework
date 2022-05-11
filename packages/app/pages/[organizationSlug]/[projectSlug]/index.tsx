import React, { ReactElement, useEffect, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { NextPage } from "next";
import { Layout, Tabs } from "antd";
import { useRouter } from "next/router";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { ProjectHeader } from "@dewo/app/containers/project/overview/ProjectHeader";
import {
  useProjectBySlug,
  useProjectDetails,
  useProjectIdBySlug,
  useProjectTasks,
} from "@dewo/app/containers/project/hooks";
import { ProjectAbout } from "@dewo/app/containers/project/about/ProjectAbout";
import { Tab } from "@dewo/app/components/Tab";
import { ProjectSettings } from "@dewo/app/containers/project/settings/ProjectSettings";
import { ForbiddenResourceModal } from "@dewo/app/components/ForbiddenResourceModal";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectSeo } from "@dewo/app/containers/seo/ProjectSeo";
import { useOrganizationBySlug } from "@dewo/app/containers/organization/hooks";
import { CommunitySuggestions } from "@dewo/app/containers/project/community/CommunitySuggestions";
import { TaskCreateModal } from "@dewo/app/containers/task/TaskCreateModal";
import { TaskStatus } from "@dewo/app/graphql/types";
import moment from "moment";
import { ProjectTaskViewProvider } from "@dewo/app/containers/task/views/TaskViewContext";
import { TaskViewTabs } from "@dewo/app/containers/task/views/TaskViewTabs";
import { ProjectEmptyColumns } from "@dewo/app/containers/project/board/ProjectTaskBoard";
import { useIsEmbedded } from "@dewo/app/util/navigation";
import { TaskViewLayout } from "@dewo/app/containers/task/views/TaskViewLayout";

const Page: NextPage = () => {
  const router = useRouter();
  const currentTab = router.query.tab as string | undefined;
  const isEmbedded = useIsEmbedded();

  const { organizationSlug, projectSlug } = router.query as {
    organizationSlug: string;
    projectSlug: string;
    viewSlug?: string;
  };
  const { organization } = useOrganizationBySlug(organizationSlug);
  const { project, error } = useProjectBySlug(projectSlug);
  const projectId = useProjectIdBySlug(projectSlug); // resolves even if has no access
  const canEditProject = usePermission("update", project);
  const details = useProjectDetails(project?.id).project;
  const organizationId = organization?.id;

  const forbiddenError = error?.message === "Forbidden resource";

  useEffect(() => {
    if (!projectSlug || !organizationSlug) {
      router.replace("/");
    }
  }, [router, projectSlug, organizationSlug]);

  const createFormInitialValues = useMemo(() => {
    if (!router.query.values) return { status: TaskStatus.TODO };
    const parsed = JSON.parse(router.query.values as string);
    return {
      ...parsed,
      dueDate: !!parsed.dueDate ? moment(parsed.dueDate) : undefined,
    };
  }, [router.query.values]);

  const tasks = useProjectTasks(projectId);

  if (!projectSlug || !organizationSlug) {
    return null;
  }

  return (
    <Layout>
      {!isEmbedded && <Sidebar />}
      <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
        {!isEmbedded && (
          <ProjectHeader
            projectId={projectId}
            organizationId={organizationId}
          />
        )}
        <Layout.Content style={{ flex: 1 }}>
          <ProjectTaskViewProvider projectId={projectId}>
            {isEmbedded ? (
              <TaskViewLayout tasks={tasks} />
            ) : (
              <TaskViewTabs
                projectId={projectId}
                activeKey={currentTab}
                extraTabs={[
                  !!details && canEditProject && (
                    <Tabs.TabPane
                      tab={
                        <Tab
                          icon={<Icons.SettingOutlined />}
                          children="Project Settings"
                        />
                      }
                      key="settings"
                      className="max-w-lg w-full dewo-layout-padding-vertical"
                      style={{ paddingTop: 24 }}
                    >
                      <ProjectSettings project={details} />
                    </Tabs.TabPane>
                  ),
                  !!project && !!details?.options?.showCommunitySuggestions && (
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
                  ),
                  <Tabs.TabPane
                    tab={
                      <Tab
                        icon={<Icons.InfoCircleOutlined />}
                        children="About"
                      />
                    }
                    key="about"
                    className="mx-auto max-w-sm w-full dewo-layout-padding-vertical"
                    style={{ paddingTop: 24 }}
                  >
                    {!!details && <ProjectAbout project={details} />}
                  </Tabs.TabPane>,
                ].filter((t): t is ReactElement => !!t)}
              >
                <TaskViewLayout empty={ProjectEmptyColumns} tasks={tasks} />
              </TaskViewTabs>
            )}
          </ProjectTaskViewProvider>
        </Layout.Content>
      </Layout.Content>
      <ForbiddenResourceModal
        visible={forbiddenError}
        projectId={projectId}
        organizationId={organizationId}
      />
      {!!details && <ProjectSeo project={details} />}
      {!!project && (
        <TaskCreateModal
          projectId={project.id}
          initialValues={createFormInitialValues}
          visible={router.route.endsWith("/create")}
          onDone={() => router.push(project.permalink)}
          onCancel={() => router.push(project.permalink)}
        />
      )}
    </Layout>
  );
};

export default Page;
