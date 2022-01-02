import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { Button } from "antd";
import { useOrganization, useUpdateOrganizationMember } from "../hooks";
import { OrganizationRole } from "@dewo/app/graphql/types";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../../auth/LoginButton";

interface Props {
  organizationId: string;
}

export const FollowOrganizationButton: FC<Props> = ({ organizationId }) => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();

  const organization = useOrganization(organizationId);
  const isMember = useMemo(
    () => !!organization?.members.some((m) => m.userId === user?.id),
    [organization, user]
  );

  const updateOrganizationMember = useUpdateOrganizationMember();
  const followOrganization = useCallback(async () => {
    try {
      setLoading(true);
      await updateOrganizationMember({
        role: OrganizationRole.FOLLOWER,
        userId: user!.id,
        organizationId,
      });
    } finally {
      setLoading(false);
    }
  }, [user, organizationId, updateOrganizationMember]);

  if (isMember) return null;
  if (!user) {
    return (
      <LoginButton type="ghost" loading={loading} icon={<Icons.StarOutlined />}>
        Follow {organization?.name}
      </LoginButton>
    );
  }

  return (
    <Button
      type="ghost"
      loading={loading}
      icon={<Icons.StarOutlined />}
      onClick={followOrganization}
    >
      Follow {organization?.name}
    </Button>
  );
};
