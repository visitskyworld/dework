import React, { FC, useCallback, useMemo, useState } from "react";
import * as qs from "query-string";
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
import {
  OrganizationIntegrationType,
  Project,
  RulePermission,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { Logo } from "@dewo/app/components/Logo";
import AnimatedBackground from "@dewo/app/assets/animated-background.svg";
import { LoginButton } from "@dewo/app/containers/auth/buttons/LoginButton";
import { useRouter } from "next/router";
import { useCreateOrganizationIntegration } from "@dewo/app/containers/integrations/hooks";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { useOrganizationDetails } from "@dewo/app/containers/organization/hooks";
import { useDefaultAbility } from "@dewo/app/contexts/PermissionsContext";
import {
  useAddRole,
  useCreateRole,
  useCreateRule,
  useOrganizationRoles,
} from "@dewo/app/containers/rbac/hooks";
import { Constants } from "@dewo/app/util/constants";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";

function usePrivateProjects(
  organizationId: string | undefined
): Project[] | undefined {
  const { ability } = useDefaultAbility(organizationId);
  const { organization } = useOrganizationDetails(organizationId);
  return useMemo(
    () =>
      organization?.projects.filter(
        (p) => !!ability && !ability.can("read", p)
      ),
    [organization?.projects, ability]
  );
}

function useGrantCoordinapeAccessToPrivateProjects(
  organizationId: string | undefined
): (projectIds: string[]) => Promise<void> {
  const createRole = useCreateRole();
  const createRule = useCreateRule();
  const addRole = useAddRole();
  const roles = useOrganizationRoles(organizationId);

  const getOrCreateIntegrationUserRole = useCallback(
    (userId: string) => {
      if (!organizationId) return;
      const existingUserRole = roles?.find((r) => r.userId === userId);
      if (!!existingUserRole) return existingUserRole;
      return createRole({ name: "", color: "", organizationId, userId });
    },
    [roles, organizationId, createRole]
  );

  return useCallback(
    async (projectIds) => {
      const userId = Constants.COORDINAPE_INTEGRATION_USER_ID;
      const userRole = await getOrCreateIntegrationUserRole(userId);
      if (!userRole) return;

      const fallbackRole = roles?.find((r) => r.fallback);
      if (!!fallbackRole) {
        await addRole(fallbackRole, userId);
      }

      for (const projectId of projectIds) {
        await createRule({
          permission: RulePermission.VIEW_PROJECTS,
          projectId,
          roleId: userRole.id,
        });
      }
    },
    [roles, addRole, createRule, getOrCreateIntegrationUserRole]
  );
}

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
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const organization = useMemo(
    () => user?.organizations.find((o) => o.id === organizationId),
    [organizationId, user]
  );
  const redirectUrl = useRouter().query.redirect as string;

  const privateProjects = usePrivateProjects(organizationId);

  const cancel = useCallback(
    () => (window.location.href = redirectUrl),
    [redirectUrl]
  );

  const createIntegration = useCreateOrganizationIntegration();
  const grantPrivateProjectAccess =
    useGrantCoordinapeAccessToPrivateProjects(organizationId);
  const [authorize, authorizing] = useRunningCallback(async () => {
    await createIntegration({
      organizationId: organizationId!,
      type: OrganizationIntegrationType.COORDINAPE,
    }).catch(() => {});

    if (!!projectIds.length) {
      await grantPrivateProjectAccess(projectIds).catch(() => {});
    }

    window.location.href = `${redirectUrl}?${qs.stringify({
      dework_organization_id: organizationId,
      dework_organization_name: organization?.name ?? "",
    })}`;
  }, [
    organizationId,
    projectIds,
    organization,
    redirectUrl,
    createIntegration,
    grantPrivateProjectAccess,
  ]);

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
                loading={authorizing}
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
                  onClick={() => logout()}
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
                  optionFilterProp="label"
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

              {!!privateProjects?.length && (
                <>
                  <Divider />
                  <FormSection
                    label={
                      <QuestionmarkTooltip
                        title="Tasks from private projects will be visible to everyone in your Coordinape circle. Circle members can read the task name, but cannot open the task details to read more."
                        marginLeft={8}
                      >
                        Optional: grant access to private projects
                      </QuestionmarkTooltip>
                    }
                  >
                    <Select
                      mode="multiple"
                      className="w-full"
                      placeholder="Select private projects..."
                      showSearch
                      optionLabelProp="label"
                      optionFilterProp="label"
                      value={projectIds}
                      onChange={setProjectIds}
                    >
                      {privateProjects.map((p) => (
                        <Select.Option key={p.id} value={p.id} label={p.name}>
                          {p.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormSection>
                </>
              )}
            </>
          )}
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
