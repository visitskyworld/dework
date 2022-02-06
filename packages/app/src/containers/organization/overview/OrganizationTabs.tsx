import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import {
  Avatar,
  Col,
  Divider,
  Grid,
  Row,
  Skeleton,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { OrganizationProjectList } from "@dewo/app/containers/organization/overview/projectList/OrganizationProjectList";
import {
  useOrganization,
  useOrganizationContributors,
  useOrganizationCoreTeam,
} from "@dewo/app/containers/organization/hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { OrganizationInviteButton } from "@dewo/app/containers/invite/OrganizationInviteButton";
import { OrganizationTaskBoard } from "@dewo/app/containers/organization/overview/OrganizationTaskBoard";
import { useRouter } from "next/router";
import { OrganizationSettings } from "../settings/OrganizationSettings";
import { FollowOrganizationButton } from "./FollowOrganizationButton";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import _ from "lodash";
import { OrganizationContributorList } from "./OrganizationContributorList";
import { EntityDetailAvatar } from "../../../components/EntityDetailAvatar";
import { Tab } from "@dewo/app/components/Tab";

interface Props {
  organizationId: string;
  currentTab: string;
  settingsTab?: string;
}

export const OrganizationTabs: FC<Props> = ({
  organizationId,
  currentTab,
  settingsTab,
}) => {
  const { organization } = useOrganization(organizationId);
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

  const coreTeam = useOrganizationCoreTeam(organizationId);
  const contributors = useOrganizationContributors(organizationId);
  const screens = Grid.useBreakpoint();

  return (
    <Tabs
      centered
      style={{ marginTop: 16 }}
      className="dewo-tabs"
      activeKey={currentTab}
      onTabClick={navigateToTab}
    >
      <Tabs.TabPane
        tab={<Tab icon={<Icons.HomeOutlined />} children="Overview" />}
        key="overview"
        className="max-w-lg mx-auto w-full"
        style={{ padding: 12 }}
      >
        <Row gutter={[24, 24]}>
          <Col
            xs={24}
            md={18}
            className={!screens.xs ? "dewo-divider-right" : undefined}
          >
            {/* <Typography.Title level={5}>Projects</Typography.Title> */}
            <OrganizationProjectList organizationId={organizationId} />
          </Col>
          <Col xs={24} md={6}>
            <Typography.Title level={5}>About</Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
              {organization?.description || "No description..."}
            </Typography.Paragraph>

            {!!organization?.details && (
              <Row style={{ gap: 8, marginBottom: 16 }}>
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
                {!organization &&
                  _.range(3).map((i) => <Skeleton.Avatar key={i} />)}
                {contributors.map((user) => (
                  <UserAvatar key={user.id} user={user} linkToProfile />
                ))}
              </Avatar.Group>
            </Row>

            <Divider />

            <Typography.Title level={5}>DAO admins</Typography.Title>
            <Row style={{ marginBottom: 16 }}>
              <Avatar.Group maxCount={3} size="large">
                {!organization &&
                  _.range(3).map((i) => <Skeleton.Avatar key={i} />)}
                {coreTeam?.map((user) => (
                  <UserAvatar key={user.id} user={user} linkToProfile />
                ))}
              </Avatar.Group>
            </Row>

            <Row style={{ rowGap: 8, columnGap: 8 }}>
              <OrganizationInviteButton organizationId={organizationId} />
              <FollowOrganizationButton organizationId={organizationId} />
            </Row>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.TeamOutlined />} children="Contributors" />}
        key="contributors"
        className="max-w-lg mx-auto w-full"
      >
        <OrganizationContributorList organizationId={organizationId} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<Tab icon={<Icons.ProjectOutlined />} children="Full Board" />}
        key="board"
        className="mx-auto w-full"
        style={{ maxWidth: 300 * 4 + 16 * 3 + 24 * 2 }}
      >
        <OrganizationTaskBoard organizationId={organizationId} />
      </Tabs.TabPane>
      {canUpdateOrganization && (
        <Tabs.TabPane
          tab={<Tab icon={<Icons.SettingOutlined />} children="Settings" />}
          key="settings"
          className="max-w-lg mx-auto w-full"
          style={{ padding: 12 }}
        >
          <OrganizationSettings
            organizationId={organizationId}
            currentTab={settingsTab ?? "profile"}
            onTabClick={navigateToSettingsTab}
          />
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};
