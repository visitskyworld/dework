import { Button, Dropdown, Menu, Tag, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import React, {
  CSSProperties,
  FC,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { useProject } from "../project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  ProjectRole,
  RoleSource,
  RulePermission,
} from "@dewo/app/graphql/types";
import { projectRoleDescription } from "../project/settings/strings";
import Link from "next/link";
import { useOrganizationRoles } from "../rbac/hooks";
import { useCreateInvite } from "./hooks";

interface Props {
  projectId: string;
  style?: CSSProperties;
}

export const ProjectInviteButton: FC<Props> = ({ projectId, style }) => {
  const [loading, setLoading] = useState(false);
  const { project } = useProject(projectId);

  const canInvite = usePermission("create", "Role");

  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createInvite = useCreateInvite();
  const inviteToProject = useCallback(
    async (permission: RulePermission) => {
      try {
        setLoading(true);
        const inviteLink = await createInvite({
          permission,
          projectId: project!.id,
        });
        copyToClipboardAndShowToast(inviteLink);
      } finally {
        setLoading(false);
      }
    },
    [createInvite, copyToClipboardAndShowToast, project]
  );
  const inviteProjectContributor = useCallback(
    () => inviteToProject(RulePermission.VIEW_PROJECTS),
    [inviteToProject]
  );
  const inviteProjectAdmin = useCallback(
    () => inviteToProject(RulePermission.MANAGE_PROJECTS),
    [inviteToProject]
  );

  const roles = useOrganizationRoles(project?.organizationId);
  const discordRoleGatingEnabled = useMemo(
    () =>
      !!roles?.some(
        (role) =>
          role.source === RoleSource.DISCORD &&
          role.rules.some((rule) => rule.projectId === projectId)
      ),
    [roles, projectId]
  );

  if (!project) return null;
  if (!canInvite) return null;
  return (
    <Dropdown
      placement="bottomCenter"
      trigger={["click"]}
      overlay={
        <Menu>
          <Menu.Item onClick={inviteProjectContributor}>
            Invite to View Project
            <Tooltip
              placement="right"
              title={
                <Typography.Text style={{ whiteSpace: "pre-line" }}>
                  {projectRoleDescription[ProjectRole.CONTRIBUTOR]}
                </Typography.Text>
              }
            >
              <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </Menu.Item>
          <Menu.Item onClick={inviteProjectAdmin}>
            Invite to Manage Project
            <Tooltip
              placement="right"
              title={
                <Typography.Text style={{ whiteSpace: "pre-line" }}>
                  {projectRoleDescription[ProjectRole.ADMIN]}
                </Typography.Text>
              }
            >
              <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </Menu.Item>
          {discordRoleGatingEnabled ? (
            <Menu.Item
              onClick={() => copyToClipboardAndShowToast(project.permalink)}
            >
              Invite with Discord role
              <Tooltip
                placement="right"
                title={
                  <Typography.Text style={{ whiteSpace: "pre-line" }}>
                    Let users join this project using their Discord server roles
                  </Typography.Text>
                }
              >
                <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </Menu.Item>
          ) : (
            <Link href={`${project.permalink}/settings/access`}>
              <a>
                <Menu.Item>
                  Setup Discord Role Gating
                  <Tag color="green" style={{ margin: 0, marginLeft: 4 }}>
                    New
                  </Tag>
                  <Tooltip
                    placement="right"
                    title={
                      <Typography.Text style={{ whiteSpace: "pre-line" }}>
                        Allow your community join this project as project
                        contributor or steward, depending on their Discord role.
                      </Typography.Text>
                    }
                  >
                    <Icons.QuestionCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </Menu.Item>
              </a>
            </Link>
          )}
        </Menu>
      }
    >
      <Button
        loading={loading}
        icon={<Icons.UsergroupAddOutlined />}
        style={style}
      >
        Invite
      </Button>
    </Dropdown>
  );
};
