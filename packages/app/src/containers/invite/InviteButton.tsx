import { Alert, Button } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback, useState } from "react";
import { useCreateInvite } from "./hooks";

interface Props {
  organizationId?: string;
  projectId?: string;
}

export const InviteButton: FC<Props> = ({ organizationId, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [inviteId, setInviteId] = useState<string>();

  const createInvite = useCreateInvite();
  const handlePress = useCallback(async () => {
    try {
      setLoading(true);
      const inviteId = await createInvite({ organizationId });
      setInviteId(inviteId);
      const inviteLink = !!projectId
        ? `${window.location.origin}/organization/${organizationId}/project/${projectId}?inviteId=${inviteId}`
        : `${window.location.origin}/organization/${organizationId}?inviteId=${inviteId}`;

      const el = document.createElement("textarea");
      el.value = inviteId;
      document.body.appendChild(el);
      el.select();
      navigator.clipboard.writeText(inviteLink);
      document.body.removeChild(el);
    } finally {
      setLoading(false);
    }
  }, [createInvite, organizationId, projectId]);

  if (!!inviteId) {
    return <Alert message="Invite link copied" type="success" showIcon />;
  }
  return (
    <Button
      type="ghost"
      loading={loading}
      icon={<Icons.UsergroupAddOutlined />}
      onClick={handlePress}
    >
      Invite
    </Button>
  );
};
