import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback } from "react";
import {
  useCopyToClipboardAndShowToast,
  useRunning,
} from "@dewo/app/util/hooks";
import { useCreateInvite } from "./hooks";
import { RulePermission } from "@dewo/app/graphql/types";

interface Props {
  organizationId: string;
}

export const OrganizationPublicInviteButton: FC<Props> = ({
  organizationId,
}) => {
  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createInvite = useCreateInvite();
  const [invitePublicUser, loading] = useRunning(
    useCallback(async () => {
      const inviteLink = await createInvite({
        permission: RulePermission.VIEW_PROJECTS,
        organizationId,
      });
      copyToClipboardAndShowToast(inviteLink);
    }, [createInvite, copyToClipboardAndShowToast, organizationId])
  );

  return (
    <Button
      icon={<Icons.UsergroupAddOutlined />}
      loading={loading}
      onClick={invitePublicUser}
    >
      Invite Contributors
    </Button>
  );
};
