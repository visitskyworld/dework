import { Alert, Button } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback, useState } from "react";
import { useCreateInvite } from "./hooks";
import { useOrganization } from "../organization/hooks";
import { useProject } from "../project/hooks";

interface Props {
  organizationId?: string;
  projectId?: string;
}

export const InviteButton: FC<Props> = ({ organizationId, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [inviteId, setInviteId] = useState<string>();
  const org = useOrganization(organizationId);
  const proj = useProject(projectId);

  const createInvite = useCreateInvite();
  const handlePress = useCallback(async () => {
    try {
      setLoading(true);
      const inviteId = await createInvite({ organizationId });
      setInviteId(inviteId);
      const inviteLink = !!proj
        ? `${window.location.origin}/o/${org.slug}/p/${proj.slug}?inviteId=${inviteId}`
        : `${window.location.origin}/o/${org.slug}?inviteId=${inviteId}`;

      const el = document.createElement("textarea");
      el.value = inviteId;
      document.body.appendChild(el);
      el.select();
      navigator.clipboard.writeText(inviteLink);
      document.body.removeChild(el);
    } finally {
      setLoading(false);
    }
  }, [createInvite, organizationId, projectId, org?.slug, proj?.slug]);

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
