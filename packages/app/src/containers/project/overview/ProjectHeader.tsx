import { Input, Skeleton, Space, Typography } from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useProject, useUpdateProject } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useToggle } from "@dewo/app/util/hooks";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import {
  useOrganization,
  useOrganizationIntegrations,
} from "../../organization/hooks";
import { OrganizationIntegrationType } from "@dewo/app/graphql/types";
import { useIsProjectPrivate } from "../../rbac/hooks";
import { DebugMenu } from "@dewo/app/components/DebugMenu";
import { ProjectInviteButton } from "../../invite/ProjectInviteButton";
import { CoordinapeMetamaskConnectButton } from "../../integrations/coordinape/CoordinapeMetamaskConnectButton";
import { CoordinapeIcon } from "@dewo/app/components/icons/Coordinape";
import { ConnectUsingDiscordRolesButton } from "../../auth/buttons/ConnectUsingDiscordRolesButton";
import { ConnectOrganizationToDiscordButton } from "../../integrations/discord/ConnectOrganizationToDiscordButton";
import { Header } from "../../navigation/header/Header";

interface Props {
  projectId?: string;
  organizationId?: string;
}

// Hardcoded discord permissions. TODO: maybe move to an API route?
const MANAGE_CHANNELS = BigInt(0x10),
  CREATE_INSTANT_INVITE = BigInt(0x1),
  MANAGE_ROLES = BigInt(0x10000000),
  SEND_MESSAGES = BigInt(0x800),
  CREATE_PRIVATE_THREADS = BigInt(0x1000000000),
  MANAGE_THREADS = BigInt(0x400000000),
  ADMINISTRATOR = BigInt(0x8);

export const ProjectHeader: FC<Props> = ({ projectId, organizationId }) => {
  const { project } = useProject(projectId);
  const isPrivate = useIsProjectPrivate(project, organizationId);
  const organization = useOrganization(organizationId);
  const canEdit = usePermission("update", project);
  const canEditOrg = usePermission("update", "Organization");

  const integrations = useOrganizationIntegrations(organizationId);
  const discordIntegration = useMemo(
    () =>
      integrations?.find((i) => i.type === OrganizationIntegrationType.DISCORD),
    [integrations]
  );
  const discordPermissions = useMemo(
    () =>
      discordIntegration?.config?.permissions
        ? BigInt(discordIntegration.config.permissions)
        : undefined,
    [discordIntegration]
  );
  const hasCorrectPermissions =
    discordPermissions &&
    (discordPermissions & ADMINISTRATOR ||
      (discordPermissions & CREATE_INSTANT_INVITE &&
        discordPermissions & MANAGE_CHANNELS &&
        discordPermissions & SEND_MESSAGES &&
        discordPermissions & CREATE_PRIVATE_THREADS &&
        discordPermissions & MANAGE_THREADS &&
        discordPermissions & MANAGE_ROLES));

  const routes = useMemo<Route[] | undefined>(() => {
    if (!organization || !project) return undefined;
    return [
      { path: "../..", breadcrumbName: "Home" },
      { path: organization.slug, breadcrumbName: organization.name },
      { path: project.slug, breadcrumbName: project.name },
    ];
  }, [organization, project]);

  const editName = useToggle();
  const [projectName, setProjectName] = useState("");
  const updateProject = useUpdateProject();
  const submitProjectName = useCallback(async () => {
    await updateProject({ id: projectId!, name: projectName });
    editName.toggleOff();
  }, [editName, updateProject, projectId, projectName]);

  const handleChange = useCallback(async (e: any) => {
    setProjectName(e.target.value);
  }, []);

  useEffect(() => {
    if (!!project) setProjectName(project.name);
  }, [project]);

  const onBlurProjectName = useCallback(() => {
    if (projectName !== project?.name) {
      submitProjectName();
    }
    editName.toggleOff();
  }, [projectName, project?.name, editName, submitProjectName]);
  return (
    <Header
      title={
        !!project ? (
          !editName.isOn ? (
            <Typography.Title
              level={3}
              style={{ margin: 0 }}
              onClick={canEdit ? editName.toggleOn : undefined}
            >
              {isPrivate && (
                <Typography.Text type="secondary">
                  <Icons.LockOutlined />
                  {"  "}
                </Typography.Text>
              )}
              {project.name}
            </Typography.Title>
          ) : (
            <Input
              disabled={!canEdit}
              autoFocus={true}
              className="ant-input dewo-field dewo-field-display ant-typography-h3"
              placeholder="Enter a project name..."
              onBlur={onBlurProjectName}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  submitProjectName();
                }
              }}
              onChange={handleChange}
              value={projectName}
            />
          )
        ) : (
          <Skeleton.Button active style={{ width: 200 }} />
        )
      }
      extra={
        !!project &&
        organizationId && (
          <Space align="center" style={{ height: "100%" }}>
            <DebugMenu projectId={project.id} organizationId={organizationId} />
            <ProjectInviteButton projectId={project.id} />
            {canEditOrg && !discordIntegration && (
              <ConnectOrganizationToDiscordButton
                name="Connect organization to Discord from Project Header"
                organizationId={project.organizationId}
              >
                Connect to Discord
              </ConnectOrganizationToDiscordButton>
            )}
            {canEditOrg && !!discordIntegration && !hasCorrectPermissions && (
              <ConnectOrganizationToDiscordButton
                name="Update Discord permissions from Project Header"
                organizationId={project.organizationId}
              >
                Update Discord Permissions
              </ConnectOrganizationToDiscordButton>
            )}
            <ConnectUsingDiscordRolesButton
              projectId={projectId}
              organizationId={organizationId}
              name="Connect user with Discord from Project Header"
              children="Connect with Discord"
            />
            <CoordinapeMetamaskConnectButton
              icon={<CoordinapeIcon />}
              organizationId={organizationId}
            />
          </Space>
        )
      }
      breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
    />
  );
};
