import { Button, Dropdown, Menu, Tag, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import React, {
  CSSProperties,
  FC,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useCreateProjectInvite } from "./hooks";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { useProject } from "../project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectIntegrationType, ProjectRole } from "@dewo/app/graphql/types";
import { projectRoleDescription } from "../project/settings/strings";
import Link from "next/link";

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
  const createProjectInvite = useCreateProjectInvite();
  const inviteToProject = useCallback(
    async (role: ProjectRole) => {
      try {
        setLoading(true);
        const inviteLink = await createProjectInvite({
          role,
          projectId: project!.id,
        });
        copyToClipboardAndShowToast(inviteLink);
      } finally {
        setLoading(false);
      }
    },
    [createProjectInvite, copyToClipboardAndShowToast, project]
  );
  const inviteProjectContributor = useCallback(
    () => inviteToProject(ProjectRole.CONTRIBUTOR),
    [inviteToProject]
  );
  const inviteProjectAdmin = useCallback(
    () => inviteToProject(ProjectRole.ADMIN),
    [inviteToProject]
  );

  const isDiscordRoleGatingEnabled = useMemo(
    () =>
      !!project?.integrations.find(
        (i) => i.type === ProjectIntegrationType.DISCORD_ROLE_GATE
      ),
    [project?.integrations]
  );

  if (!project) return null;
  if (isDiscordRoleGatingEnabled) {
    return (
      <Button
        type="ghost"
        loading={loading}
        icon={<Icons.UsergroupAddOutlined />}
        style={style}
        onClick={() => copyToClipboardAndShowToast(project.permalink)}
      >
        Invite
      </Button>
    );
  }

  if (canInvite) {
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
          </Menu>
        }
      >
        <Button
          type="ghost"
          loading={loading}
          icon={<Icons.UsergroupAddOutlined />}
          style={style}
        >
          Invite
        </Button>
      </Dropdown>
    );
  }

  return null;
};
