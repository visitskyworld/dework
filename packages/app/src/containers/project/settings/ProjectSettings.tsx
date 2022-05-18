import { Project, ProjectDetails } from "@dewo/app/graphql/types";
import { Card, Divider, Tabs, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useRouter } from "next/router";
import { Tab } from "@dewo/app/components/Tab";
import * as Icons from "@ant-design/icons";
import { ProjectSettingsGithubIntegration } from "./ProjectSettingsGithubIntegration";
import { ProjectSettingsDiscordIntegration } from "./ProjectSettingsDiscordIntegration";
import { ProjectSettingsPaymentMethod } from "./ProjectSettingsPaymentMethod";
import { ProjectSettingsGeneral } from "./ProjectSettingsGeneral";
import { ProjectSettingsTokenGating } from "./ProjectSettingsTokenGating";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectSettingsManage } from "./ProjectSettingsManage";
import { ProjectRBAC } from "../../rbac/project/ProjectRBAC";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

interface Props {
  project: ProjectDetails;
}

interface SettingTab {
  key: string;
  icon: JSX.Element;
  title: string;
  component: FC<any>;
}

export const useProjectSettingsTabs = (project?: Project) => {
  const canRemoveProject = usePermission("delete", project);

  const array: SettingTab[] = useMemo(
    () =>
      [
        {
          key: "general",
          icon: <Icons.AppstoreOutlined />,
          title: "General",
          component: ProjectSettingsGeneral,
        },
        {
          key: "discord",
          icon: <DiscordIcon />,
          title: "Discord Integration",
          component: ProjectSettingsDiscordIntegration,
        },
        {
          key: "github",
          icon: <Icons.GithubOutlined />,
          title: "Github Integration",
          component: ProjectSettingsGithubIntegration,
        },
        {
          key: "access",
          icon: <Icons.LockOutlined />,
          title: "Permissions",
          component: ({ project }: { project: Project }) => (
            <>
              <Typography.Title level={4} style={{ marginBottom: 4 }}>
                Permissions
              </Typography.Title>
              <Divider style={{ marginTop: 0 }} />
              <ProjectRBAC
                organizationId={project.organizationId}
                projectId={project.id}
              />
            </>
          ),
        },
        {
          key: "payment-method",
          icon: <Icons.CreditCardOutlined />,
          title: "Payments",
          component: ProjectSettingsPaymentMethod,
        },
        {
          key: "token-gating",
          icon: <Icons.SafetyCertificateOutlined />,
          title: "Token Gating",
          component: ProjectSettingsTokenGating,
        },
        !!canRemoveProject && {
          key: "manage",
          icon: <Icons.SettingOutlined />,
          title: "Manage",
          component: ProjectSettingsManage,
        },
      ].filter((a): a is SettingTab => !!a),
    [canRemoveProject]
  );

  return array;
};

export const ProjectSettings: FC<Props> = ({ project }) => {
  const screens = useBreakpoint();

  const router = useRouter();
  const currentTab =
    (router.query.settingsTab as string | undefined) ?? "general";

  const navigateToSettingsTab = useCallback(
    (tab: string) => router.push(`${project!.permalink}/settings/${tab}`),
    [project, router]
  );

  const settingsTabs = useProjectSettingsTabs(project);

  const isDesktop = screens.md;
  const tabStyle = { paddingLeft: isDesktop ? 24 : 0, maxWidth: 700 };
  return (
    <Tabs
      type="card"
      tabPosition={isDesktop ? "left" : "top"}
      className="dewo-settings-tabs"
      activeKey={currentTab}
      onTabClick={navigateToSettingsTab}
      renderTabBar={(props, TabBar) => (
        <Card
          size="small"
          title="Settings"
          style={{ marginBottom: isDesktop ? 0 : 24 }}
          bodyStyle={{ padding: 0 }}
        >
          <TabBar {...props} tabPosition="left" />
        </Card>
      )}
    >
      {settingsTabs.map((settingsTab) => (
        <Tabs.TabPane
          tab={<Tab icon={settingsTab.icon} children={settingsTab.title} />}
          key={settingsTab.key}
          style={tabStyle}
        >
          <settingsTab.component project={project} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};
