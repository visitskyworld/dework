import { Input, PageHeader, Skeleton, Space, Typography } from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useProject, useUpdateProject } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useToggle } from "@dewo/app/util/hooks";
import { FollowOrganizationButton } from "../../organization/overview/FollowOrganizationButton";
import { ProjectInviteButton } from "../../invite/ProjectInviteButton";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { useIsProjectPrivate } from "../../rbac/hooks";
import { useOrganizationDetails } from "../../organization/hooks";
import { ConnectUsingDiscordRolesButton } from "../../auth/ConnectUsingDiscordRolesButton";
import { ConnectOrganizationToDiscordButton } from "../../integrations/ConnectOrganizationToDiscordButton";
import { OrganizationIntegrationType } from "@dewo/app/graphql/types";

interface Props {
  projectId?: string;
  organizationId?: string;
}

// Hardcoded discord permissions. TODO: maybe move to an API route?
const MANAGE_CHANNELS = BigInt(0x10),
  MANAGE_ROLES = BigInt(0x10000000),
  SEND_MESSAGES = BigInt(0x800),
  MANAGE_THREADS = BigInt(0x400000000);

export const ProjectHeader: FC<Props> = ({ projectId, organizationId }) => {
  const { project } = useProject(projectId);
  const isPrivate = useIsProjectPrivate(project);
  const { organization } = useOrganizationDetails(organizationId);
  const canEdit = usePermission("update", project);
  const canEditOrg = usePermission("update", "Organization");

  const discordIntegration = useMemo(
    () =>
      organization?.integrations.find(
        (i) => i.type === OrganizationIntegrationType.DISCORD
      ),
    [organization]
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
    discordPermissions & MANAGE_CHANNELS &&
    discordPermissions & SEND_MESSAGES &&
    discordPermissions & MANAGE_THREADS &&
    discordPermissions & MANAGE_ROLES;

  const routes = useMemo<Route[] | undefined>(() => {
    if (!organization || !project) return undefined;
    return [
      {
        path: "../..",
        breadcrumbName: "Home",
      },
      {
        path: organization.slug,
        breadcrumbName: organization.name,
      },
      {
        path: project.slug,
        breadcrumbName: project.name,
      },
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

  return (
    <PageHeader
      className="dewo-project-header"
      style={{ paddingBottom: 0 }}
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
              onBlur={editName.toggleOff}
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
      // subTitle={
      //   !!project ? (
      //     <Row align="middle">
      //       <Avatar.Group maxCount={3} size="large" style={{ marginRight: 16 }}>
      //         {project?.members.map((m) => (
      //           <UserAvatar key={m.id} user={m.user} linkToProfile />
      //         ))}
      //       </Avatar.Group>
      //     </Row>
      //   ) : (
      //     <Skeleton.Avatar active size="large" />
      //   )
      // }
      extra={
        !!project &&
        organizationId && (
          <Space align="center" style={{ height: "100%" }}>
            <ProjectInviteButton projectId={project.id} />
            {canEditOrg && (!discordIntegration || !hasCorrectPermissions) && (
              <ConnectOrganizationToDiscordButton
                type="ghost"
                organizationId={project.organizationId}
              >
                {!discordIntegration
                  ? "Connect to Discord"
                  : "Update Discord Permissions"}
              </ConnectOrganizationToDiscordButton>
            )}
            <FollowOrganizationButton
              organizationId={project?.organizationId}
            />
            <ConnectUsingDiscordRolesButton
              type="ghost"
              projectId={projectId}
              organizationId={organizationId}
              children="Connect with Discord"
            />
          </Space>
        )
      }
      breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
    />
  );
};
