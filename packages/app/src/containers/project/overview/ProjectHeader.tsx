import {
  Button,
  Dropdown,
  Input,
  Menu,
  Skeleton,
  Space,
  Typography,
} from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useProject, useUpdateProject } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useToggle } from "@dewo/app/util/hooks";
import { useOrganizationIntegrations } from "../../organization/hooks";
import { OrganizationIntegrationType } from "@dewo/app/graphql/types";
import { useIsProjectPrivate } from "../../rbac/hooks";
import { DebugMenu } from "@dewo/app/components/DebugMenu";
import { ProjectInviteButton } from "../../invite/ProjectInviteButton";
import { CoordinapeMetamaskConnectButton } from "../../integrations/coordinape/CoordinapeMetamaskConnectButton";
import { CoordinapeIcon } from "@dewo/app/components/icons/Coordinape";
import { ConnectUsingDiscordRolesButton } from "../../auth/buttons/ConnectUsingDiscordRolesButton";
import { ConnectOrganizationToDiscordButton } from "../../integrations/discord/ConnectOrganizationToDiscordButton";
import { Header } from "../../navigation/header/Header";
import Link from "next/link";
import { useProjectSettingsTabs } from "../settings/ProjectSettings";
import { BlockButton } from "@dewo/app/components/BlockButton";
import styles from "./ProjectHeader.module.less";
import classNames from "classnames";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { project } = useProject(projectId);
  const isPrivate = useIsProjectPrivate(project, organizationId);
  const canEdit = usePermission("update", project);
  const canEditOrg = usePermission("update", "Organization");
  const redirect = `${router.asPath}/settings/discord`;

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

  const settingsTabs = useProjectSettingsTabs(project);

  return (
    <Header
      className={classNames(styles.projectHeader, "bg-body-secondary")}
      style={{ paddingBottom: 0 }}
      title={
        !!project ? (
          <Space wrap>
            {!editName.isOn ? (
              <Typography.Title
                level={4}
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
            )}
            {!!canEdit && (
              <Dropdown
                trigger={["click"]}
                overlay={
                  <Menu>
                    {settingsTabs.map((settingsTab) => (
                      <Menu.Item key={settingsTab.key} icon={settingsTab.icon}>
                        <Link
                          href={`${project.permalink}/settings/${settingsTab.key}`}
                        >
                          {settingsTab.title}
                        </Link>
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <Button
                  type="text"
                  className="text-secondary"
                  icon={<Icons.SettingOutlined />}
                  style={{ paddingLeft: 8, paddingRight: 8 }}
                >
                  <Icons.DownOutlined />
                </Button>
              </Dropdown>
            )}
            {!!project && organizationId && (
              <Space wrap>
                <DebugMenu
                  projectId={project.id}
                  organizationId={organizationId}
                />
                <ProjectInviteButton projectId={project.id} />
                {canEditOrg && !discordIntegration && (
                  <ConnectOrganizationToDiscordButton
                    name="Connect organization to Discord from Project Header"
                    organizationId={project.organizationId}
                    redirect={redirect}
                  >
                    Connect to Discord
                  </ConnectOrganizationToDiscordButton>
                )}
                {canEditOrg && !!discordIntegration && !hasCorrectPermissions && (
                  <ConnectOrganizationToDiscordButton
                    name="Update Discord permissions from Project Header"
                    organizationId={project.organizationId}
                    redirect={redirect}
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
            )}
          </Space>
        ) : (
          <Skeleton.Button active style={{ width: 200 }} />
        )
      }
      extra={
        !!project &&
        organizationId && (
          <Space
            align="center"
            style={{ height: "100%", justifyContent: "end" }}
          >
            <BlockButton
              href={`${project.permalink}/about`}
              type="text"
              icon={<Icons.InfoCircleOutlined />}
            >
              About
            </BlockButton>
            {!!canEdit && (
              <BlockButton
                className={styles.extraButtons}
                href={`${project.permalink}/settings/discord`}
                type="text"
                icon={<Icons.ShareAltOutlined />}
                name="Project Header: integrations"
              >
                Integrations
              </BlockButton>
            )}
            {!!canEdit && (
              <BlockButton
                className={styles.extraButtons}
                href={`${project.permalink}/settings/access`}
                type="text"
                icon={<Icons.SafetyOutlined />}
                name="Project Header: access"
              >
                Access & Permissions
              </BlockButton>
            )}
          </Space>
        )
      }
    />
  );
};
