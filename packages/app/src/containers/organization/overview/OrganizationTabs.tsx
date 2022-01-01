import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { Avatar, Col, Divider, Row, Skeleton, Tabs, Typography } from "antd";

import { OrganizationProjectList } from "@dewo/app/containers/organization/overview/OrganizationProjectList";
import { useOrganization } from "@dewo/app/containers/organization/hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { InviteButton } from "@dewo/app/containers/invite/InviteButton";
import { OrganizationTaskBoard } from "@dewo/app/containers/organization/overview/OrganizationTaskBoard";
import { useRouter } from "next/router";
import { OrganizationSettings } from "./OrganizationSettings";

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

  const router = useRouter();
  const navigateToTab = useCallback(
    (tab: string) => router.push(`${organization!.permalink}/${tab}`),
    [organization, router]
  );
  const navigateToSettingsTab = useCallback(
    (tab: string) => router.push(`${organization!.permalink}/settings/${tab}`),
    [organization, router]
  );

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
            <Typography.Title level={5}>Intro</Typography.Title>
            <Skeleton loading={!organization} paragraph={{ rows: 6 }}>
              <Typography.Paragraph
                type="secondary"
                style={{ marginBottom: 8, maxWidth: 480 }}
                ellipsis={{ rows: 6 }}
              >
                {organization?.description ?? "No description..."}
              </Typography.Paragraph>
            </Skeleton>

            <Divider />

            <Typography.Title level={5}>Contributors</Typography.Title>
            <Row>
              <Avatar.Group maxCount={3} size="large">
                {!organization &&
                  [1, 2, 3].map((i) => <Skeleton.Avatar key={i} />)}
                {organization?.members.map((m) => (
                  <UserAvatar key={m.id} user={m.user} linkToProfile />
                ))}
              </Avatar.Group>
            </Row>
            <InviteButton
              organizationId={organizationId}
              style={{ marginTop: 16 }}
            />
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
        className="max-w-lg mx-auto w-full"
      >
        <OrganizationSettings
          organizationId={organizationId}
          currentTab="contributors"
          onTabClick={navigateToSettingsTab}
        />
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
        style={{ maxWidth: 300 * 4 + 16 * 5 }}
      >
        <OrganizationTaskBoard organizationId={organizationId} />
      </Tabs.TabPane>
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
          currentTab={settingsTab ?? "contributors"}
          onTabClick={navigateToSettingsTab}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};
