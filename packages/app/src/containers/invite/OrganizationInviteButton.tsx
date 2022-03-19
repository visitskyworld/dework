import { Button, Dropdown, Menu } from "antd";
import * as Icons from "@ant-design/icons";
import React, { CSSProperties, FC, useCallback } from "react";
import { useCreateOrganizationInvite } from "./hooks";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useOrganizationDetails } from "../organization/hooks";

interface Props {
  organizationId: string;
  style?: CSSProperties;
}

export const OrganizationInviteButton: FC<Props> = ({
  organizationId,
  style,
}) => {
  const { organization } = useOrganizationDetails(organizationId);
  const canInvite = usePermission("create", "Role");

  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createOrganizationInvite = useCreateOrganizationInvite();
  const inviteOrganizationAdmin = useCallback(async () => {
    const inviteLink = await createOrganizationInvite({
      organizationId: organization!.id,
    });
    copyToClipboardAndShowToast(inviteLink);
  }, [createOrganizationInvite, copyToClipboardAndShowToast, organization]);
  const inviteToTokenGatedProjects = useCallback(async () => {
    copyToClipboardAndShowToast(organization!.permalink);
  }, [copyToClipboardAndShowToast, organization]);

  if (!organization) return null;

  const hasTokenGatedProjects = !!organization.projectTokenGates.length;
  if (canInvite && !hasTokenGatedProjects) {
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

  if (!canInvite && hasTokenGatedProjects) {
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

  if (canInvite && hasTokenGatedProjects) {
    return (
      <Dropdown
        placement="topCenter"
        trigger={["click"]}
        overlay={
          <Menu>
            {canInvite && (
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
