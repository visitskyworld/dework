import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { Avatar, Col, Divider, Row, Skeleton, Tabs, Typography } from "antd";
import { OrganizationProjectList } from "@dewo/app/containers/organization/overview/OrganizationProjectList";
import {
  useOrganization,
  useOrganizationContributors,
  useOrganizationCoreTeam,
} from "@dewo/app/containers/organization/hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { OrganizationInviteButton } from "@dewo/app/containers/invite/OrganizationInviteButton";
import { OrganizationTaskBoard } from "@dewo/app/containers/organization/overview/OrganizationTaskBoard";
import { useRouter } from "next/router";
import { OrganizationSettings } from "./OrganizationSettings";
import { FollowOrganizationButton } from "./FollowOrganizationButton";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { OrganizationMemberList } from "./OrganizationMemberList";
import _ from "lodash";

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
  const organization = useOrganization(organizationId);
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

  return (
    <Tabs
      centered
      style={{ marginTop: 16 }}
      activeKey={currentTab}
      onTabClick={navigateToTab}
    >
      <Tabs.TabPane
        tab={
          <>
            <Icons.HomeOutlined />
            Overview
          </>
        }
        key="overview"
        className="max-w-lg mx-auto w-full"
      >
        <Row gutter={48}>
          <Col span={18} className="dewo-divider-right">
            <Typography.Title level={5}>Projects</Typography.Title>
            <OrganizationProjectList organizationId={organizationId} />
          </Col>
          <Col span={6}>
            <Typography.Title level={5}>Contributors</Typography.Title>
            <Row style={{ marginBottom: 16 }}>
              <Avatar.Group maxCount={10} size="large">
                {!organization &&
                  _.range(3).map((i) => <Skeleton.Avatar key={i} />)}
                {contributors.map((user) => (
                  <UserAvatar key={user.id} user={user} linkToProfile />
                ))}
              </Avatar.Group>
            </Row>

            <Divider />

            <Typography.Title level={5}>Core team</Typography.Title>
            <Row style={{ marginBottom: 16 }}>
              <Avatar.Group maxCount={10} size="large">
                {!organization &&
                  _.range(3).map((i) => <Skeleton.Avatar key={i} />)}
                {contributors.map((user) => (
                  <UserAvatar key={user.id} user={user} linkToProfile />
                ))}
              </Avatar.Group>
            </Row>

            <Divider />

            <Typography.Title level={5}>Core team</Typography.Title>
            <Row style={{ marginBottom: 16 }}>
              <Avatar.Group maxCount={3} size="large">
                {!organization &&
                  _.range(3).map((i) => <Skeleton.Avatar key={i} />)}
                {coreTeam?.map((user) => (
                  <UserAvatar key={user.id} user={user} linkToProfile />
                ))}
              </Avatar.Group>
            </Row>

            <OrganizationInviteButton organizationId={organizationId} />
            <FollowOrganizationButton organizationId={organizationId} />
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <>
            <Icons.TeamOutlined />
            Contributors
          </>
        }
        key="contributors"
        className="max-w-sm mx-auto w-full"
      >
        <OrganizationMemberList organizationId={organizationId} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <>
            <Icons.ProjectOutlined />
            Full Board
          </>
        }
        key="board"
        className="mx-auto w-full"
        style={{ maxWidth: 300 * 4 + 16 * 3 + 24 * 2 }}
      >
        <OrganizationTaskBoard organizationId={organizationId} />
      </Tabs.TabPane>
      {canUpdateOrganization && (
        <Tabs.TabPane
          tab={
            <>
              <Icons.SettingOutlined />
              Settings
            </>
          }
          key="settings"
          className="max-w-lg mx-auto w-full"
        >
          <OrganizationSettings
            organizationId={organizationId}
            currentTab={settingsTab ?? "members"}
            onTabClick={navigateToSettingsTab}
          />
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};
