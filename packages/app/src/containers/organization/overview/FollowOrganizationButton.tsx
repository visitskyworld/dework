import React, { FC, useCallback, CSSProperties, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { Button } from "antd";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { LoginButton } from "../../auth/buttons/LoginButton";
import {
  useFollowOrganization,
  useUnfollowOrganization,
} from "../../rbac/hooks";
import { eatClick } from "../../../util/eatClick";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

interface Props {
  showUnfollow?: boolean;
  organizationId: string;
  style?: CSSProperties;
}

export const FollowOrganizationButton: FC<Props> = ({
  organizationId,
  showUnfollow = false,
  style,
}) => {
  const followOrganization = useFollowOrganization(organizationId);
  const [handleFollow, loadingFollow] = useRunningCallback(followOrganization, [
    followOrganization,
  ]);
  const handleFollowClick = useCallback(
    (event: any) => {
      eatClick(event);
      handleFollow();
    },
    [handleFollow]
  );
  const unfollowOrganization = useUnfollowOrganization(organizationId);
  const [handleUnfollow, loadingUnfollow] = useRunningCallback(
    unfollowOrganization,
    [unfollowOrganization]
  );
  const handleUnfollowClick = useCallback(
    (event: any) => {
      eatClick(event);
      handleUnfollow();
    },
    [handleUnfollow]
  );

  const { user } = useAuthContext();
  const isFollowing = useMemo(
    () => user?.organizations.some((o) => o.id === organizationId),
    [user?.organizations, organizationId]
  );

  if (!user) {
    return (
      <LoginButton type="primary" icon={<Icons.StarOutlined />}>
        Follow
      </LoginButton>
    );
  }

  if (!isFollowing) {
    return (
      <Button
        type="primary"
        loading={loadingFollow}
        icon={<Icons.StarOutlined />}
        style={style}
        onClick={handleFollowClick}
      >
        Follow
      </Button>
    );
  } else if (showUnfollow) {
    return (
      <Button
        name="Unfollow organization"
        loading={loadingUnfollow}
        icon={<Icons.MinusCircleOutlined />}
        style={style}
        onClick={handleUnfollowClick}
      >
        Unfollow
      </Button>
    );
  }

  return null;
};
