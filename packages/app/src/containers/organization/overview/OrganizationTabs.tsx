import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { Col, Row, Tabs } from "antd";
import {
  useOrganizationDetails,
  useOrganizationTasks,
} from "@dewo/app/containers/organization/hooks";
import { useRouter } from "next/router";
import { OrganizationSettings } from "../settings/OrganizationSettings";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { OrganizationContributorList } from "./OrganizationContributorList";
import { Tab } from "@dewo/app/components/Tab";
import styles from "./OrganizationTabs.module.less";
import { TopContributorList } from "./TopContributorList";
import { TopReviewerList } from "./TopReviewerList";
import { OrganizationTaskViewProvider } from "../../task/views/TaskViewContext";
import { TaskViewTabs } from "../../task/views/TaskViewTabs";
import { TaskViewLayout } from "../../task/views/TaskViewLayout";
import { Header } from "../../navigation/header/Header";
import { OrganizationOverview } from "./OrganizationOverview";
import { useMounted } from "@dewo/app/util/hooks";

interface Props {
  organizationId: string;
  currentTab: string;
  settingsTab?: string;
}

const CombinedBoard: FC<{ organizationId: string }> = ({ organizationId }) => {
  const tasks = useOrganizationTasks(
    organizationId,
    undefined,
    "cache-and-network"
  )?.tasks;

  return (
    <OrganizationTaskViewProvider organizationId={organizationId}>
      <TaskViewTabs organizationId={organizationId}>
        <TaskViewLayout tasks={tasks} />
      </TaskViewTabs>
    </OrganizationTaskViewProvider>
  );
};

export const OrganizationTabs: FC<Props> = ({
  organizationId,
  currentTab,
  settingsTab,
}) => {
  const { organization } = useOrganizationDetails(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");

  const router = useRouter();
  const navigateToTab = useCallback(
    (tab: string) => router.push(`${organization!.permalink}/${tab}`),
    [organization, router]
  );
  const navigateToSettingsTab = useCallback(
    (tab: string) => router.push(`${organization!.permalink}/settings/${tab}`),
    [organization, router]
  );

  const mounted = useMounted();

  return (
    <Tabs
      className={styles.tabs}
      activeKey={currentTab}
      onTabClick={navigateToTab}
    >
      <Tabs.TabPane
        tab={<Tab icon={<Icons.HomeOutlined />} children="Overview" />}
        key="overview"
      >
        <OrganizationOverview organizationId={organizationId} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.TeamOutlined />} children="Contributors" />}
        key="contributors"
      >
        <Header title="Contributors" />
        {!!mounted && (
          <Row gutter={[16, 24]} className="dewo-layout-padding-vertical">
            <Col className="gutter-row" sm={24} md={24} lg={12}>
              <TopContributorList organizationId={organizationId} />
            </Col>
            <Col className="gutter-row" sm={24} md={24} lg={12}>
              <TopReviewerList organizationId={organizationId} />
            </Col>
            <Col lg={24}>
              <OrganizationContributorList organizationId={organizationId} />
            </Col>
          </Row>
        )}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.ProjectOutlined />} children="Combined Board" />}
        key="board"
        className="w-full"
        style={{ height: "100%" }}
      >
        <Header
          className="bg-body-secondary"
          title="Combined Board"
          style={{ paddingBottom: 0 }}
        />
        <CombinedBoard organizationId={organizationId} />
      </Tabs.TabPane>
      {canUpdateOrganization && (
        <Tabs.TabPane
          tab={<Tab icon={<Icons.SettingOutlined />} children="Settings" />}
          key="settings"
        >
          <Header title="Organization Settings" />
          <div className="max-w-lg w-full dewo-layout-padding-vertical">
            <OrganizationSettings
              organizationId={organizationId}
              currentTab={settingsTab ?? "profile"}
              onTabClick={navigateToSettingsTab}
            />
          </div>
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};
