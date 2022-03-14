import React, { FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { Button } from "antd";
import { useAddRole, useOrganization, useOrganizationUsers } from "../hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../../auth/LoginButton";
import { useRunningCallback } from "@dewo/app/util/hooks";

interface Props {
  organizationId: string;
}

export const FollowOrganizationButton: FC<Props> = ({ organizationId }) => {
  const { user } = useAuthContext();

  const { organization } = useOrganization(organizationId);
  const users = useOrganizationUsers(organizationId);
  const fallbackRole = useMemo(
    () => organization?.roles.find((r) => r.fallback),
    [organization?.roles]
  );

  const addRole = useAddRole();
  const isFollowing = useMemo(
    () =>
      users?.some(
        (u) =>
          u.id === user?.id && u.roles.some((r) => r.id === fallbackRole?.id)
      ),
    [users, user, fallbackRole]
  );

  const [handleAddRole, addingRole] = useRunningCallback(async () => {
    await addRole(fallbackRole!.id, user!.id);
  }, [user, fallbackRole, addRole]);

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
      loading={addingRole}
      icon={<Icons.StarOutlined />}
      onClick={handleAddRole}
    >
      Follow {organization?.name}
    </Button>
  );
};
