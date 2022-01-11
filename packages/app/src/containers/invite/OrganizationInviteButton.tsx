import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import React, { CSSProperties, FC, useCallback, useState } from "react";
import {
  useCopyToClipboardAndShowToast,
  useCreateOrganizationInvite,
} from "./hooks";
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
  const [loading, setLoading] = useState(false);
  const { organization } = useOrganization(organizationId);

  const canInviteOrganizationAdmin = usePermission("create", {
    __typename: "OrganizationMember",
    role: OrganizationRole.ADMIN,
  });

  const copyToClipboardAndShowToast = useCopyToClipboardAndShowToast();
  const createOrganizationInvite = useCreateOrganizationInvite();
  const inviteOrganizationAdmin = useCallback(async () => {
    try {
      setLoading(true);
      const inviteId = await createOrganizationInvite({
        organizationId: organization!.id,
        role: OrganizationRole.ADMIN,
      });
      const inviteLink = `${organization!.permalink}?inviteId=${inviteId}`;
      copyToClipboardAndShowToast(inviteLink);
    } finally {
      setLoading(false);
    }
  }, [createOrganizationInvite, copyToClipboardAndShowToast, organization]);

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

  return null;
};
