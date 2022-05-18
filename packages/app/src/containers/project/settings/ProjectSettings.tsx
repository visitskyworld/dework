import { ProjectDetails } from "@dewo/app/graphql/types";
import { Card, Divider, Tabs, Typography } from "antd";
import React, { FC, useCallback } from "react";
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

export const ProjectSettings: FC<Props> = ({ project }) => {
  const screens = useBreakpoint();

  const router = useRouter();
  const currentTab =
    (router.query.settingsTab as string | undefined) ?? "general";

  const canRemoveProject = usePermission("delete", project);

  const navigateToSettingsTab = useCallback(
    (tab: string) => router.push(`${project!.permalink}/settings/${tab}`),
    [project, router]
  );

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
      <Tabs.TabPane
        tab={<Tab icon={<Icons.AppstoreOutlined />} children="General" />}
        key="general"
        style={tabStyle}
      >
        <ProjectSettingsGeneral project={project} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<DiscordIcon />} children="Discord Integration" />}
        key="discord"
        style={tabStyle}
      >
        <ProjectSettingsDiscordIntegration project={project} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Tab icon={<Icons.GithubOutlined />} children="Github Integration" />
        }
        key="github"
        style={tabStyle}
      >
        <ProjectSettingsGithubIntegration projectId={project.id} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.LockOutlined />} children="Permissions" />}
        key="access"
        style={tabStyle}
      >
        <Typography.Title level={4} style={{ marginBottom: 4 }}>
          Permissions
        </Typography.Title>
        <Divider style={{ marginTop: 0 }} />
        <ProjectRBAC
          projectId={project.id}
          organizationId={project.organizationId}
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.CreditCardOutlined />} children="Payments" />}
        key="payment-method"
        style={tabStyle}
      >
        <ProjectSettingsPaymentMethod projectId={project.id} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Tab
            icon={<Icons.SafetyCertificateOutlined />}
            children="Token Gating"
          />
        }
        key="token-gating"
        style={tabStyle}
      >
        <ProjectSettingsTokenGating project={project} />
      </Tabs.TabPane>
      {canRemoveProject ? (
        <Tabs.TabPane
          tab={<Tab icon={<Icons.SettingOutlined />} children="Manage" />}
          key="manage"
          style={tabStyle}
        >
          <ProjectSettingsManage project={project} />
        </Tabs.TabPane>
      ) : null}
    </Tabs>
  );
};
