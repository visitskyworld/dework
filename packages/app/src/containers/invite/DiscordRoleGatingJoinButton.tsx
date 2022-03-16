import React, { FC, useMemo } from "react";
import { Button, ButtonProps, message } from "antd";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../auth/LoginButton";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import {
  ProjectIntegrationType,
  ThreepidSource,
} from "@dewo/app/graphql/types";
import { ThreepidAuthButton } from "../auth/ThreepidAuthButton";
import { useRouter } from "next/router";
import { useJoinProjectsWithDiscordRole } from "./hooks";
import { useOrganization } from "../organization/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useProject } from "../project/hooks";
import { useRunningCallback } from "@dewo/app/util/hooks";

interface Props extends ButtonProps {
  children: string;
  projectId?: string;
  organizationId: string;
}

export const DiscordRoleGatingJoinButton: FC<Props> = ({
  children,
  projectId,
  organizationId,
  ...buttonProps
}) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { project } = useProject(projectId);
  const refetchOrganization = useOrganization(organizationId).refetch;
  const isConnectedToDiscord = useMemo(
    () => !!user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user?.threepids]
  );

  const joinProjectsWithDiscordRole = useJoinProjectsWithDiscordRole();
  const [handleJoin, joining] = useRunningCallback(async () => {
    const projects = await joinProjectsWithDiscordRole(organizationId);
    if (projects.length) {
      for (const project of projects) {
        message.success(`Joined ${project.name}`);
      }
    } else {
      message.warn("No projects available for you to join at this time!");
    }

    await refetchOrganization();
  }, [joinProjectsWithDiscordRole, organizationId, refetchOrganization]);

  const canAccessAllProjects = usePermission("update", "Project");
  const isMember = useMemo(
    () => !!project?.members.some((m) => m.user.id === user?.id),
    [project, user?.id]
  );

  const { organization } = useOrganization(organizationId);
  const hasDiscordRoleGating = useMemo(
    () =>
      !!organization?.integrations
        .map((i) => i.discordRoleGates)
        .flat()
        .some(
          (g) =>
            !g.deletedAt &&
            g.type === ProjectIntegrationType.DISCORD_ROLE_GATE &&
            (!projectId || g.projectId === projectId)
        ),
    [organization?.integrations, projectId]
  );

  if (!hasDiscordRoleGating || canAccessAllProjects || isMember) {
    return null;
  }

  if (!user) {
    return (
      <LoginButton
        {...buttonProps}
        icon={<DiscordIcon />}
        onAuthedWithWallet={handleJoin}
      >
        {children}
      </LoginButton>
    );
  }

  if (!isConnectedToDiscord) {
    return (
      <ThreepidAuthButton
        source={ThreepidSource.discord}
        {...buttonProps}
        icon={<DiscordIcon />}
        state={{ redirect: router.asPath }}
      >
        {" "}
        {children}
      </ThreepidAuthButton>
    );
  }

  return (
    <Button
      {...buttonProps}
      icon={<DiscordIcon />}
      loading={joining}
      onClick={handleJoin}
    >
      {children}
    </Button>
  );
};
