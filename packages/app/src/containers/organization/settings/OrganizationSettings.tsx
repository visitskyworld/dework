import { Tab } from "@dewo/app/components/Tab";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Card, Divider, Tabs, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import React, { FC } from "react";
import { OrganizationRBAC } from "../../rbac/organization/OrganizationRBAC";
import { OrganizationProfileSettings } from "./OrganizationProfileSettings";
import { OrganizationIntegrations } from "./OrganizationIntegrations";
import { OrganizationSettingsManage } from "./OrganizationSettingsManage";

interface Props {
  organizationId: string;
  currentTab: string;
  onTabClick(tab: string): void;
}

export const OrganizationSettings: FC<Props> = ({
  currentTab,
  organizationId,
  onTabClick,
}) => {
  const canDeleteOrganization = usePermission("delete", "Organization");
  const screens = useBreakpoint();
  return (
    <Tabs
      type="card"
      tabPosition={screens.sm ? "left" : "top"}
      className="dewo-settings-tabs"
      activeKey={currentTab}
      onTabClick={onTabClick}
      renderTabBar={(props, TabBar) => (
        <Card
          size="small"
          title="Settings"
          style={{ marginBottom: screens.sm ? 0 : 24 }}
          bodyStyle={{ padding: 0 }}
        >
          <TabBar {...props} tabPosition="left" />
        </Card>
      )}
    >
      <Tabs.TabPane
        tab={<Tab icon={<Icons.AppstoreOutlined />} children="Profile" />}
        key="profile"
      >
        <OrganizationProfileSettings organizationId={organizationId} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.LockOutlined />} children="Permissions" />}
        key="access"
      >
        <Typography.Title level={4} style={{ marginBottom: 4 }}>
          Permissions
        </Typography.Title>
        <Divider style={{ marginTop: 0 }} />
        <OrganizationRBAC organizationId={organizationId} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.ShareAltOutlined />} children="Integrations" />}
        key="integrations"
      >
        <Typography.Title level={4} style={{ marginBottom: 4 }}>
          Integrations
        </Typography.Title>
        <Divider style={{ marginTop: 0 }} />
        <OrganizationIntegrations organizationId={organizationId} />
      </Tabs.TabPane>
      {canDeleteOrganization && (
        <Tabs.TabPane
          tab={<Tab icon={<Icons.SettingOutlined />} children="Manage" />}
          key="manage"
        >
          <OrganizationSettingsManage organizationId={organizationId} />
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};
