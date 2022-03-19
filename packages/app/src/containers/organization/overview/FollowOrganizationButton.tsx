import React, { FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { Button } from "antd";
import { useOrganization, useOrganizationUsers } from "../hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../../auth/LoginButton";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { useFollowOrganization, useOrganizationRoles } from "../../rbac/hooks";

interface Props {
  organizationId: string;
}

export const FollowOrganizationButton: FC<Props> = ({ organizationId }) => {
  const followOrganization = useFollowOrganization(organizationId);
  const [handleFollow, loading] = useRunningCallback(followOrganization, [
    followOrganization,
  ]);

  const { user } = useAuthContext();

  const roles = useOrganizationRoles(organizationId);
  const organization = useOrganization(organizationId);
  const { users } = useOrganizationUsers(organizationId);
  const fallbackRole = useMemo(() => roles?.find((r) => r.fallback), [roles]);

  const isFollowing = useMemo(
    () =>
      users?.some(
        (u) =>
          u.id === user?.id && u.roles.some((r) => r.id === fallbackRole?.id)
      ),
    [users, user, fallbackRole]
  );

  if (isFollowing || !fallbackRole) return null;
  if (!user) {
    return (
      <LoginButton type="ghost" icon={<Icons.StarOutlined />}>
        Follow {organization?.name}
      </LoginButton>
    );
  }

  return (
    <Button
      type="ghost"
      loading={loading}
      icon={<Icons.StarOutlined />}
      onClick={handleFollow}
    >
      Follow {organization?.name}
    </Button>
  );
};
