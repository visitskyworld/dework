import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import {
  Avatar,
  Col,
  Divider,
  Grid,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { OrganizationProjectList } from "@dewo/app/containers/organization/overview/projectList/OrganizationProjectList";
import {
  useOrganizationDetails,
  useOrganizationTasks,
  useOrganizationUsers,
} from "@dewo/app/containers/organization/hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { OrganizationInviteButton } from "@dewo/app/containers/invite/OrganizationInviteButton";
import { useRouter } from "next/router";
import { OrganizationSettings } from "../settings/OrganizationSettings";
import { FollowOrganizationButton } from "./FollowOrganizationButton";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import _ from "lodash";
import { OrganizationContributorList } from "./OrganizationContributorList";
import { EntityDetailAvatar } from "../../../components/EntityDetailAvatar";
import { Tab } from "@dewo/app/components/Tab";
import { DebugMenu } from "@dewo/app/components/DebugMenu";
import { OrganizationTaskDiscoveryList } from "./taskDiscovery/OrganizationTaskDiscoveryList";
import styles from "./OrganizationTabs.module.less";
import { TopContributorList } from "./TopContributorList";
import { TopReviewerList } from "./TopReviewerList";
import { OrganizationPublicInviteButton } from "../../invite/OrganizationPublicInviteButton";
import { OrganizationHeaderSummary } from "./OrganizationHeaderSummary";
import { RichMarkdownEditor } from "@dewo/app/components/richMarkdownEditor/RichMarkdownEditor";
import { OrganizationTaskViewProvider } from "../../task/views/TaskViewContext";
import { TaskViewTabs } from "../../task/views/TaskViewTabs";
import { TaskViewLayout } from "../../task/views/TaskViewLayout";
import { Header } from "../../navigation/header/Header";

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

  const screens = Grid.useBreakpoint();
  const { users, admins } = useOrganizationUsers(organizationId);

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
        <Header />
        <Row
          style={{ paddingBottom: 8 }}
          className="dewo-layout-padding-vertical"
        >
          <OrganizationHeaderSummary organizationId={organizationId} />
        </Row>
        <Divider />
        <Row
          gutter={[screens.xs ? 0 : 48, 24]}
          style={{ marginTop: 20 }}
          className="max-w-xxl w-full dewo-layout-padding-vertical"
        >
          <Col
            xs={24}
            md={18}
            className={!screens.xs ? "dewo-divider-right" : undefined}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <OrganizationProjectList organizationId={organizationId} />
              <OrganizationTaskDiscoveryList organizationId={organizationId} />
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Typography.Title level={5}>About</Typography.Title>
            <div style={{ opacity: 0.7 }}>
              <RichMarkdownEditor
                initialValue={organization?.description || "No description..."}
                editable={false}
                mode="create"
              />
            </div>

            {!!organization?.details && (
              <Row style={{ gap: 8, marginBottom: 16, marginTop: 8 }}>
                {organization.details.map((detail) => (
                  <EntityDetailAvatar entityDetail={detail} key={detail.id} />
                ))}
              </Row>
            )}

            {!!organization?.tags.length && (
              <Row style={{ gap: 8 }}>
                {organization?.tags.map((tag) => (
                  <Tag
                    key={tag.id}
                    color={tag.color}
                    style={{ margin: 0, marginBottom: 8 }}
                  >
                    {tag.label}
                  </Tag>
                ))}
              </Row>
            )}

            <Divider />

            <Typography.Title level={5}>Contributors</Typography.Title>
            <Row style={{ marginBottom: 16 }}>
              <Avatar.Group maxCount={6} size="large">
                {!users &&
                  _.range(3).map((i) => (
                    <Skeleton.Avatar size="large" key={i} />
                  ))}
                {users?.map((user) => (
                  <UserAvatar key={user.id} user={user} linkToProfile />
                ))}
              </Avatar.Group>
            </Row>
            <OrganizationPublicInviteButton />

            <Divider />

            <Typography.Title level={5}>DAO admins</Typography.Title>
            <Row style={{ marginBottom: 16 }}>
              <Avatar.Group maxCount={3} size="large">
                {!admins &&
                  _.range(3).map((i) => (
                    <Skeleton.Avatar size="large" key={i} />
                  ))}
                {admins?.map((user) => (
                  <UserAvatar key={user.id} user={user} linkToProfile />
                ))}
              </Avatar.Group>
            </Row>

            <Row style={{ rowGap: 8, columnGap: 8 }}>
              <OrganizationInviteButton organizationId={organizationId} />
              <FollowOrganizationButton
                organizationId={organizationId}
                showUnfollow
              />
              <DebugMenu organizationId={organizationId} />
            </Row>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.TeamOutlined />} children="Contributors" />}
        key="contributors"
      >
        <Header title="Contributors" />
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
