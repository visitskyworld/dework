import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Layout,
  List,
  Row,
  Select,
  Typography,
} from "antd";
import * as Icons from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { FormSection } from "@dewo/app/components/FormSection";
import { TaskStatusAvatar } from "@dewo/app/containers/task/TaskStatusAvatar";
import { TaskStatus } from "@dewo/app/graphql/types";
import { Logo } from "@dewo/app/components/Logo";
import AnimatedBackground from "@dewo/app/assets/animated-background.svg";
import { LoginButton } from "@dewo/app/containers/auth/LoginButton";
import { useRouter } from "next/router";

const Page: FC = () => {
  const { user, logout } = useAuthContext();
  const appName = "Coordinape";
  const appImageUrl = "https://avatars.githubusercontent.com/u/80926529";
  const permissions = [
    {
      icon: <TaskStatusAvatar status={TaskStatus.DONE} size="small" />,
      label: "Read selected organization's tasks in public projects",
    },
    {
      icon: (
        <TaskStatusAvatar
          status={TaskStatus.TODO}
          icon={<Icons.CloseOutlined />}
          size="small"
        />
      ),
      label: "Read selected organization's tasks in private projects",
    },
  ];
  const [organizationId, setOrganizationId] = useState<string>();
  const organization = useMemo(
    () => user?.organizations.find((o) => o.id === organizationId),
    [organizationId, user]
  );
  const redirectUrl = useRouter().query.redirect as string;

  const cancel = useCallback(
    () => (window.location.href = redirectUrl),
    [redirectUrl]
  );
  const authorize = useCallback(
    () =>
      (window.location.href = `${redirectUrl}?dework_organization_id=${organizationId}&dework_organization_name=${
        organization?.name ?? ""
      }`),
    [organizationId, organization, redirectUrl]
  );

  return (
    <Layout
      style={{
        background: `url(${AnimatedBackground.src})`,
        backgroundSize: "cover",
      }}
    >
      <Layout.Header style={{ display: "flex", alignItems: "center" }}>
        <Logo />
      </Layout.Header>
      <Layout.Content
        style={{ display: "grid", placeItems: "center", padding: 12 }}
      >
        <Card
          style={{ backdropFilter: "blur(10px)" }}
          bodyStyle={{ padding: 48 }}
          actions={[
            <Button type="text" key="cancel" onClick={cancel}>
              Cancel
            </Button>,
            !!user ? (
              <Button
                type="primary"
                key="authorize"
                disabled={!organizationId}
                onClick={authorize}
              >
                Authorize
              </Button>
            ) : (
              <LoginButton type="primary" key="connect">
                Connect
              </LoginButton>
            ),
          ]}
        >
          <Row
            style={{ alignItems: "center", justifyContent: "center", gap: 16 }}
          >
            <Avatar src={appImageUrl} size={80} />
            {!!user && (
              <>
                <Icons.EllipsisOutlined
                  style={{ fontSize: "200%", opacity: 0.5 }}
                />
                <UserAvatar user={user} size={80} />
              </>
            )}
          </Row>
          <Col style={{ textAlign: "center", marginTop: 24 }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {appName}
            </Typography.Title>
            <Typography.Paragraph type="secondary">
              wants to access your account
            </Typography.Paragraph>
            {!!user && (
              <Typography.Paragraph
                type="secondary"
                className="ant-typography-caption"
              >
                Signed in as {user.username}
                <Typography.Text
                  strong
                  className="text-primary hover:cursor-pointer"
                  style={{ marginLeft: 8 }}
                  onClick={logout}
                >
                  Not you?
                </Typography.Text>
              </Typography.Paragraph>
            )}
          </Col>
          <Divider />
          {!!user && (
            <>
              <FormSection label="Add to organization:">
                <Select
                  className="w-full"
                  placeholder="Select an organization..."
                  showSearch
                  optionLabelProp="label"
                  value={organizationId}
                  onChange={setOrganizationId}
                >
                  {user.organizations.map((o) => (
                    <Select.Option key={o.id} value={o.id} label={o.name}>
                      {o.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormSection>
              <FormSection label={`This will allow ${appName} to:`}>
                <List
                  style={{ marginTop: 8 }}
                  dataSource={permissions}
                  renderItem={(item) => (
                    <Row
                      style={{ alignItems: "center", gap: 16, marginBottom: 8 }}
                    >
                      {item.icon}
                      <Typography.Text style={{ flex: 1 }}>
                        {item.label}
                      </Typography.Text>
                    </Row>
                  )}
                />
              </FormSection>
            </>
          )}
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
