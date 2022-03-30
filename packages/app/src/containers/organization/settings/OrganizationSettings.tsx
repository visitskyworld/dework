import { Tab } from "@dewo/app/components/Tab";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Card, Divider, Modal, Tabs, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect } from "react";
import { OrganizationRBAC } from "../../rbac/organization/OrganizationRBAC";
import { useUpdateOrganization } from "../hooks";
import { OrganizationProfileSettings } from "./OrganizationProfileSettings";
import { OrganizationIntegrations } from "./OrganizationIntegrations";

interface Props {
  organizationId: string;
  currentTab: string;
  onTabClick(tab: string): void;
}

const ConfirmDeleteOrganization: FC<{ organizationId: string }> = ({
  organizationId,
}) => {
  const router = useRouter();
  const updateOrganization = useUpdateOrganization();
  const deleteOrganization = useCallback(async () => {
    try {
      await updateOrganization({
        id: organizationId,
        deletedAt: new Date().toISOString(),
      });
      await router.push("/");
    } catch (err) {}
  }, [updateOrganization, organizationId, router]);
  useEffect(() => {
    Modal.confirm({
      title: "Do you want to delete this organization?",
      onOk: () => deleteOrganization(),
      onCancel: () => router.back(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

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
          tab={
            <Tab
              icon={<Icons.DeleteOutlined />}
              children="Delete Organization"
            />
          }
          key="delete"
        >
          {currentTab === "delete" && (
            <ConfirmDeleteOrganization organizationId={organizationId} />
          )}
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};
