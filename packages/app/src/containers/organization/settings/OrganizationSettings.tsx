import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Card, Modal, Tabs } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect } from "react";
import { useUpdateOrganization } from "../hooks";
import { OrganizationMemberList } from "../overview/OrganizationMemberList";
import { OrganizationProfileSettings } from "./OrganizationProfileSettings";

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
      <Tabs.TabPane tab="Profile" key="profile">
        <OrganizationProfileSettings organizationId={organizationId} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="DAO admins" key="members">
        <OrganizationMemberList organizationId={organizationId} />
      </Tabs.TabPane>
      {canDeleteOrganization && (
        <Tabs.TabPane tab="Delete Organization" key="delete">
          {currentTab === "delete" && (
            <ConfirmDeleteOrganization organizationId={organizationId} />
          )}
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};
