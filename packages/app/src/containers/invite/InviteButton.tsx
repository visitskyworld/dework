import { Button, Dropdown, Menu, message } from "antd";
import * as Icons from "@ant-design/icons";
import React, { CSSProperties, FC, useCallback, useState } from "react";
import { useCreateOrganizationInvite, useCreateProjectInvite } from "./hooks";
import { useOrganization } from "../organization/hooks";
import { useProject } from "../project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { OrganizationRole, ProjectRole } from "@dewo/app/graphql/types";

interface Props {
  organizationId?: string;
  projectId?: string;
  style?: CSSProperties;
}

export const InviteButton: FC<Props> = ({
  organizationId,
  projectId,
  style,
}) => {
  const [loading, setLoading] = useState(false);
  const organization = useOrganization(organizationId);
  const project = useProject(projectId);

  const canInviteOrganizationAdmin = usePermission("create", {
    __typename: "OrganizationMember",
    role: OrganizationRole.ADMIN,
  });
  const canInviteProjectAdmin = usePermission("create", {
    __typename: "ProjectMember",
    role: ProjectRole.ADMIN,
  });
  const canInviteProjectContributor = usePermission("create", {
    __typename: "ProjectMember",
    role: ProjectRole.CONTRIBUTOR,
  });

  const copyToClipboardAndShowSuccessMessage = useCallback(
    (inviteLink: string) => {
      const el = document.createElement("textarea");
      el.value = inviteLink;
      document.body.appendChild(el);
      el.select();
      navigator.clipboard.writeText(inviteLink);
      document.body.removeChild(el);

      message.success({ content: "Invite link copied", type: "success" });
    },
    []
  );

  const createOrganizationInvite = useCreateOrganizationInvite();
  const inviteOrganizationAdmin = useCallback(async () => {
    try {
      setLoading(true);
      const inviteId = await createOrganizationInvite({
        organizationId: organization!.id,
        role: OrganizationRole.ADMIN,
      });
      const inviteLink = `${organization!.permalink}?inviteId=${inviteId}`;
      copyToClipboardAndShowSuccessMessage(inviteLink);
    } finally {
      setLoading(false);
    }
  }, [
    createOrganizationInvite,
    copyToClipboardAndShowSuccessMessage,
    organization,
  ]);

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
        copyToClipboardAndShowSuccessMessage(inviteLink);
      } finally {
        setLoading(false);
      }
    },
    [createProjectInvite, copyToClipboardAndShowSuccessMessage, project]
  );
  const inviteProjectContributor = useCallback(
    () => inviteToProject(ProjectRole.CONTRIBUTOR),
    [inviteToProject]
  );
  const inviteProjectAdmin = useCallback(
    () => inviteToProject(ProjectRole.ADMIN),
    [inviteToProject]
  );

  if (!!organization && canInviteOrganizationAdmin) {
    return (
      <Button
        type="ghost"
        loading={loading}
        icon={<Icons.UsergroupAddOutlined />}
        style={style}
        onClick={inviteOrganizationAdmin}
      >
        Invite Core Team
      </Button>
    );
  }

  if (!!project && canInviteProjectContributor && !canInviteProjectAdmin) {
    return (
      <Button
        type="ghost"
        loading={loading}
        icon={<Icons.UsergroupAddOutlined />}
        style={style}
        onClick={inviteProjectContributor}
      >
        Invite Contributor
      </Button>
    );
  }

  if (!!project && canInviteProjectContributor && !!canInviteProjectAdmin) {
    return (
      <Dropdown
        placement="bottomCenter"
        trigger={["click"]}
        overlay={
          <Menu>
            <Menu.Item onClick={inviteProjectContributor}>
              Invite Contributor(s)
            </Menu.Item>
            <Menu.Item onClick={inviteProjectAdmin}>
              Invite Project Admin
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
  }

  return null;
};
