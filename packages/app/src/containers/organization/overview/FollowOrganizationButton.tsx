import React, { FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { Button } from "antd";
import { useOrganization, useOrganizationUsers } from "../hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../../auth/LoginButton";
import { useRunningCallback } from "@dewo/app/util/hooks";
import {
  useFollowOrganization,
  useUnfollowOrganization,
} from "../../rbac/hooks";

interface Props {
  organizationId: string;
}

export const FollowOrganizationButton: FC<Props> = ({ organizationId }) => {
  const followOrganization = useFollowOrganization(organizationId);
  const [handleFollow, loadingFollow] = useRunningCallback(followOrganization, [
    followOrganization,
  ]);
  const unfollowOrganization = useUnfollowOrganization(organizationId);
  const [handleUnfollow, loadingUnfollow] = useRunningCallback(
    unfollowOrganization,
    [unfollowOrganization]
  );

  const { user } = useAuthContext();
  const organization = useOrganization(organizationId);
  const { users } = useOrganizationUsers(organizationId);

  const isFollowing = useMemo(
    () => users?.some((u) => u.id === user?.id),
    [users, user]
  );

  if (!user) {
    return (
      <LoginButton type="ghost" icon={<Icons.StarOutlined />}>
        Follow {organization?.name}
      </LoginButton>
    );
  }

  if (isFollowing) {
    return (
      <Button
        type="ghost"
        loading={loadingUnfollow}
        icon={<Icons.MinusCircleOutlined />}
        onClick={handleUnfollow}
      >
        Unfollow {organization?.name}
      </Button>
    );
  }

  return (
    <Button
      type="ghost"
      loading={loadingFollow}
      icon={<Icons.StarOutlined />}
      onClick={handleFollow}
    >
      Follow {organization?.name}
    </Button>
  );
};
