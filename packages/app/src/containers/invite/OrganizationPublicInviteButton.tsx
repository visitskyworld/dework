import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback } from "react";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";

export const OrganizationPublicInviteButton: FC = () => {
  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");

  const invitePublicUser = useCallback(async () => {
    const inviteLink = window.location.href;
    copyToClipboardAndShowToast(inviteLink);
  }, [copyToClipboardAndShowToast]);

  return (
    <Button icon={<Icons.UsergroupAddOutlined />} onClick={invitePublicUser}>
      Invite Contributors
    </Button>
  );

  return null;
};
