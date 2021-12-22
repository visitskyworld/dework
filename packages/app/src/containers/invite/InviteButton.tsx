import { Alert, Button, Dropdown, Menu } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback, useState } from "react";
import { useCreateInvite } from "./hooks";
import { useOrganization } from "../organization/hooks";
import { useProject } from "../project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { OrganizationRole } from "@dewo/app/graphql/types";

interface Props {
  organizationId?: string;
  projectId?: string;
}

export const InviteButton: FC<Props> = ({ organizationId, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [inviteId, setInviteId] = useState<string>();
  const org = useOrganization(organizationId);
  const proj = useProject(projectId);

  const canInviteAdmin = usePermission("create", {
    __typename: "OrganizationMember",
    role: OrganizationRole.ADMIN,
  });
  const canInviteMember = usePermission("create", {
    __typename: "OrganizationMember",
    role: OrganizationRole.MEMBER,
  });

  const createInvite = useCreateInvite();
  const inviteByRole = useCallback(
    async (role: OrganizationRole) => {
      try {
        setLoading(true);
        const inviteId = await createInvite({
          role,
          organizationId: organizationId!,
        });
        setInviteId(inviteId);
        const inviteLink = !!proj
          ? `${window.location.origin}/o/${org!.slug}/p/${
              proj!.slug
            }?inviteId=${inviteId}`
          : `${window.location.origin}/o/${org!.slug}?inviteId=${inviteId}`;

        const el = document.createElement("textarea");
        el.value = inviteId;
        document.body.appendChild(el);
        el.select();
        navigator.clipboard.writeText(inviteLink);
        document.body.removeChild(el);
      } finally {
        setLoading(false);
      }
    },
    [createInvite, organizationId, org, proj]
  );
  const inviteAdmin = useCallback(
    () => inviteByRole(OrganizationRole.ADMIN),
    [inviteByRole]
  );
  const inviteMember = useCallback(
    () => inviteByRole(OrganizationRole.MEMBER),
    [inviteByRole]
  );

  if (!org || !proj || !canInviteMember) return null;
  if (!!inviteId) {
    return <Alert message="Invite link copied" type="success" showIcon />;
  }

  if (!canInviteAdmin) {
    return (
      <Button
        type="ghost"
        loading={loading}
        icon={<Icons.UsergroupAddOutlined />}
        onClick={inviteMember}
      >
        Invite
      </Button>
    );
  }

  return (
    <Dropdown
      placement="bottomCenter"
      trigger={["click"]}
      overlay={
        <Menu theme="dark">
          <Menu.Item onClick={inviteMember}>Invite Member(s)</Menu.Item>
          <Menu.Item onClick={inviteAdmin}>Invite Admin</Menu.Item>
        </Menu>
      }
    >
      <Button
        type="ghost"
        loading={loading}
        icon={<Icons.UsergroupAddOutlined />}
      >
        Invite
      </Button>
    </Dropdown>
  );
};
