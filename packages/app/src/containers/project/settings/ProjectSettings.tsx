import { ProjectDetails } from "@dewo/app/graphql/types";
import { Card, Tabs } from "antd";
import React, { FC, useCallback } from "react";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useRouter } from "next/router";
import { Tab } from "@dewo/app/components/Tab";
import * as Icons from "@ant-design/icons";
import { ProjectSettingsIntegrations } from "./ProjectSettingsIntegrations";
import { ProjectSettingsPaymentMethod } from "./ProjectSettingsPaymentMethod";
import { ProjectSettingsGeneral } from "./ProjectSettingsGeneral";
import { ProjectSettingsTokenGating } from "./ProjectSettingsTokenGating";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectSettingsManage } from "./ProjectSettingsManage";
import { ProjectSettingsDiscordRoleGating } from "./discordRoleGating/DiscordRoleGating";
import { ProjectRBAC } from "../../rbac/project/ProjectRBAC";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettings: FC<Props> = ({ project }) => {
  const screens = useBreakpoint();

  const router = useRouter();
  const currentTab =
    (router.query.settingsTab as string | undefined) ?? "general";

  const canRemoveProject = usePermission("delete", "Project");

  const navigateToSettingsTab = useCallback(
    (tab: string) => router.push(`${project!.permalink}/settings/${tab}`),
    [project, router]
  );

  const isDesktop = screens.sm;
  const tabStyle = { paddingLeft: isDesktop ? 24 : 0, maxWidth: 550 };
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
        tab={<Tab icon={<Icons.ShareAltOutlined />} children="Integrations" />}
        key="integrations"
        style={tabStyle}
      >
        <ProjectSettingsIntegrations project={project} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.CreditCardOutlined />} children="Payments" />}
        key="payment-method"
        style={tabStyle}
      >
        <ProjectSettingsPaymentMethod project={project} />
      </Tabs.TabPane>
      {/* <Tabs.TabPane
        tab={<Tab icon={<Icons.TeamOutlined />} children="Members" />}
        key="members"
        style={tabStyle}
      >
        <ProjectSettingsMembers project={project} />
      </Tabs.TabPane> */}
      <Tabs.TabPane
        tab={
          <Tab icon={<Icons.SafetyCertificateOutlined />} children="Access" />
        }
        key="access"
        style={tabStyle}
      >
        <ProjectRBAC
          projectId={project.id}
          organizationId={project.organizationId}
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Tab
            icon={<Icons.SafetyCertificateOutlined />}
            children="Token/Role Gating (old)"
          />
        }
        key="token-gating"
        style={tabStyle}
      >
        <ProjectSettingsTokenGating project={project} />
        <ProjectSettingsDiscordRoleGating project={project} />
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
