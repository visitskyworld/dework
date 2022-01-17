import { Button, Dropdown, Menu } from "antd";
import * as Icons from "@ant-design/icons";
import React, { CSSProperties, FC, useCallback } from "react";
import { useCreateOrganizationInvite } from "./hooks";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { useOrganization } from "../organization/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { OrganizationRole } from "@dewo/app/graphql/types";

interface Props {
  organizationId: string;
  style?: CSSProperties;
}

export const OrganizationInviteButton: FC<Props> = ({
  organizationId,
  style,
}) => {
  const { organization } = useOrganization(organizationId);

  const canInviteOrganizationAdmin = usePermission("create", {
    __typename: "OrganizationMember",
    role: OrganizationRole.ADMIN,
  });

  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createOrganizationInvite = useCreateOrganizationInvite();
  const inviteOrganizationAdmin = useCallback(async () => {
    const inviteId = await createOrganizationInvite({
      organizationId: organization!.id,
      role: OrganizationRole.ADMIN,
    });
    const inviteLink = `${organization!.permalink}?inviteId=${inviteId}`;
    copyToClipboardAndShowToast(inviteLink);
  }, [createOrganizationInvite, copyToClipboardAndShowToast, organization]);
  const inviteToTokenGatedProjects = useCallback(async () => {
    copyToClipboardAndShowToast(organization!.permalink);
  }, [copyToClipboardAndShowToast, organization]);

  if (!organization) return null;

  const hasTokenGatedProjects = !!organization.projectTokenGates.length;
  if (canInviteOrganizationAdmin && !hasTokenGatedProjects) {
    return (
      <Button
        type="ghost"
        icon={<Icons.UsergroupAddOutlined />}
        style={style}
        onClick={inviteOrganizationAdmin}
      >
        Invite DAO admins
      </Button>
    );
  }

  if (!canInviteOrganizationAdmin && hasTokenGatedProjects) {
    return (
      <Button
        type="ghost"
        icon={<Icons.UsergroupAddOutlined />}
        style={style}
        onClick={inviteToTokenGatedProjects}
      >
        Invite
      </Button>
    );
  }

  if (canInviteOrganizationAdmin && hasTokenGatedProjects) {
    return (
      <Dropdown
        placement="topCenter"
        trigger={["click"]}
        overlay={
          <Menu>
            {canInviteOrganizationAdmin && (
              <Menu.Item key="admin" onClick={inviteOrganizationAdmin}>
                Invite DAO admins
              </Menu.Item>
            )}
            {hasTokenGatedProjects && (
              <Menu.Item key="gated" onClick={inviteToTokenGatedProjects}>
                Invite to Token Gated Projects
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <Button
          type="ghost"
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
