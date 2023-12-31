import { Button, Dropdown, Menu } from "antd";
import * as Icons from "@ant-design/icons";
import React, { CSSProperties, FC, useCallback } from "react";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useOrganizationDetails } from "../organization/hooks";
import { RulePermission } from "@dewo/app/graphql/types";
import { useCreateInvite } from "./hooks";

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
  const createInvite = useCreateInvite();
  const inviteOrganizationAdmin = useCallback(async () => {
    const inviteLink = await createInvite({
      organizationId: organization!.id,
      permission: RulePermission.MANAGE_ORGANIZATION,
    });
    copyToClipboardAndShowToast(inviteLink);
  }, [createInvite, copyToClipboardAndShowToast, organization]);
  const inviteToTokenGatedProjects = useCallback(async () => {
    copyToClipboardAndShowToast(organization!.permalink);
  }, [copyToClipboardAndShowToast, organization]);

  if (!organization) return null;

  const hasTokenGatedProjects = !!organization.projectTokenGates.length;
  if (canInvite && !hasTokenGatedProjects) {
    return (
      <Button
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
        <Button icon={<Icons.UsergroupAddOutlined />} style={style}>
          Invite
        </Button>
      </Dropdown>
    );
  }

  return null;
};
