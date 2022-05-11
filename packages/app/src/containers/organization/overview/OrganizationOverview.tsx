import React, { FC } from "react";
import {
  Avatar,
  Col,
  Divider,
  Grid,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { OrganizationProjectList } from "@dewo/app/containers/organization/overview/projectList/OrganizationProjectList";
import {
  useOrganizationDetails,
  useOrganizationUsers,
} from "@dewo/app/containers/organization/hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { OrganizationInviteButton } from "@dewo/app/containers/invite/OrganizationInviteButton";
import { FollowOrganizationButton } from "./FollowOrganizationButton";
import _ from "lodash";
import { EntityDetailAvatar } from "../../../components/EntityDetailAvatar";
import { DebugMenu } from "@dewo/app/components/DebugMenu";
import { OrganizationTaskDiscoveryList } from "./taskDiscovery/OrganizationTaskDiscoveryList";
import { OrganizationPublicInviteButton } from "../../invite/OrganizationPublicInviteButton";
import { OrganizationHeaderSummary } from "./OrganizationHeaderSummary";
import { RichMarkdownEditor } from "@dewo/app/components/richMarkdownEditor/RichMarkdownEditor";
import { Header } from "../../navigation/header/Header";

interface Props {
  organizationId: string;
}

export const OrganizationOverview: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganizationDetails(organizationId);
  const { users, admins } = useOrganizationUsers(organizationId);
  const screens = Grid.useBreakpoint();
  if (_.isEmpty(screens)) return null;
  return (
    <>
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
                _.range(3).map((i) => <Skeleton.Avatar size="large" key={i} />)}
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
                _.range(3).map((i) => <Skeleton.Avatar size="large" key={i} />)}
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
    </>
  );
};
