import { Alert, Button } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useCreateInvite } from "./hooks";

interface Props {
  organizationId?: string;
}

export const InviteButton: FC<Props> = ({ organizationId }) => {
  const [loading, setLoading] = useState(false);
  const [inviteId, setInviteId] = useState<string>();

  const createInvite = useCreateInvite();
  const handlePress = useCallback(async () => {
    try {
      setLoading(true);
      const inviteId = await createInvite({ organizationId });
      setInviteId(inviteId);
      const inviteLink = `${window.location.origin}/auth?inviteId=${inviteId}`;

      const el = document.createElement("textarea");
      el.value = inviteId;
      document.body.appendChild(el);
      el.select();
      navigator.clipboard.writeText(inviteLink);
      document.body.removeChild(el);
    } finally {
      setLoading(false);
    }
  }, [createInvite, organizationId]);

  if (!!inviteId) {
    return <Alert message="Invite link copied" type="success" showIcon />;
  }
  return (
    <Button type="ghost" loading={loading} onClick={handlePress}>
      Invite
    </Button>
  );
};
