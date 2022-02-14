import { Button, Dropdown, Menu } from "antd";
import * as Icons from "@ant-design/icons";
import React, { CSSProperties, FC, useCallback, useState } from "react";
import { useCreateProjectInvite } from "./hooks";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { useProject } from "../project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { ProjectRole } from "@dewo/app/graphql/types";

interface Props {
  projectId: string;
  style?: CSSProperties;
}

export const ProjectInviteButton: FC<Props> = ({ projectId, style }) => {
  const [loading, setLoading] = useState(false);
  const { project } = useProject(projectId);

  const canInviteProjectAdmin = usePermission("create", {
    __typename: "ProjectMember",
    role: ProjectRole.ADMIN,
  });
  const canInviteProjectContributor = usePermission("create", {
    __typename: "ProjectMember",
    role: ProjectRole.CONTRIBUTOR,
  });

  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createProjectInvite = useCreateProjectInvite();
  const inviteToProject = useCallback(
    async (role: ProjectRole) => {
      try {
        setLoading(true);
        const inviteId = await createProjectInvite({
          role,
          projectId: project!.id,
        });
        const inviteLink = `${project!.permalink}?inviteId=${inviteId}`;
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

  if (!!project && canInviteProjectContributor) {
    if (canInviteProjectAdmin) {
      return (
        <Dropdown
          placement="bottomCenter"
          trigger={["click"]}
          overlay={
            <Menu>
              <Menu.Item onClick={inviteProjectContributor}>
                Invite Contributors
              </Menu.Item>
              <Menu.Item onClick={inviteProjectAdmin}>
                Invite Project Steward
              </Menu.Item>
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
    } else {
      return (
        <Button
          type="ghost"
          loading={loading}
          icon={<Icons.UsergroupAddOutlined />}
          style={style}
          onClick={inviteProjectContributor}
        >
          Invite Contributors
        </Button>
      );
    }
  }

  return null;
};
