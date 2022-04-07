import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { RoleSource, ThreepidSource } from "@dewo/app/graphql/types";
import { ButtonProps } from "antd";
import React, { FC, useMemo } from "react";
import { useRolesWithAccess } from "../../rbac/hooks";
import { LoginButton } from "./LoginButton";
import { ThreepidAuthButton } from "./ThreepidAuthButton";

interface Props extends ButtonProps {
  organizationId: string;
  projectId?: string;
  children: string;
}

export const ConnectUsingDiscordRolesButton: FC<Props> = ({
  organizationId,
  projectId,
  ...buttonProps
}) => {
  const { user } = useAuthContext();
  const roles = useRolesWithAccess(organizationId, projectId);
  const isConnectedToDiscord = useMemo(
    () => user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user]
  );
  const isDiscordRoleAllowedAccess = useMemo(
    () => !!roles?.some((r) => r.source === RoleSource.DISCORD),
    [roles]
  );

  if (!isDiscordRoleAllowedAccess) return null;
  if (!user) {
    return <LoginButton {...buttonProps} />;
  }

  if (isConnectedToDiscord) return null;
  return (
    <ThreepidAuthButton {...buttonProps} source={ThreepidSource.discord} />
  );
};
