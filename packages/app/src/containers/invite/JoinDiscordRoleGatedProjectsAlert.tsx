import { Alert, Button, message } from "antd";
import React, { CSSProperties, FC, useCallback, useMemo } from "react";
import { useOrganization } from "../organization/hooks";
import { LoginButton } from "../auth/LoginButton";
import {
  ProjectIntegrationType,
  ThreepidSource,
} from "@dewo/app/graphql/types";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { useJoinProjectsWithDiscordRole } from "./hooks";
import { ThreepidAuthButton } from "../auth/ThreepidAuthButton";
import _ from "lodash";
import { useRouter } from "next/router";

interface Props {
  organizationId: string;
  style?: CSSProperties;
}

export const JoinDiscordRoleGatedProjectsAlert: FC<Props> = ({
  organizationId,
  style,
}) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { organization, refetch } = useOrganization(organizationId);

  const projectIdsWithDiscordRoleGates = useMemo(
    () =>
      organization?.integrations
        .map((i) => i.discordRoleGates)
        .flat()
        .filter(
          (g) =>
            g.type === ProjectIntegrationType.DISCORD_ROLE_GATE && !g.deletedAt
        )
        .map((g) => g.projectId),
    [organization?.integrations]
  );
  const canJoinProjectWithDiscordRole = useMemo(
    () =>
      !!_.difference(
        projectIdsWithDiscordRoleGates,
        organization?.projects.map((p) => p.id) ?? []
      ).length,
    [projectIdsWithDiscordRoleGates, organization?.projects]
  );

  const isConnectedToDiscord = useMemo(
    () => !!user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user?.threepids]
  );

  const joinProjectsWithDiscordRole = useJoinProjectsWithDiscordRole();
  const handleJoin = useCallback(async () => {
    const projects = await joinProjectsWithDiscordRole(organizationId);
    if (projects.length) {
      for (const project of projects) {
        message.success(`Joined ${project.name}`);
      }
    } else {
      message.warn("No projects available for you to join at this time!");
    }

    await refetch();
  }, [joinProjectsWithDiscordRole, organizationId, refetch]);

  const canAccessAllProjects = usePermission("update", "Project");
  if (canAccessAllProjects || !canJoinProjectWithDiscordRole) {
    return null;
  }

  const button = (() => {
    if (!user) {
      return (
        <LoginButton
          type="primary"
          icon={<DiscordIcon />}
          onAuthedWithWallet={handleJoin}
        >
          Join using Discord roles
        </LoginButton>
      );
    }

    if (!isConnectedToDiscord) {
      return (
        <ThreepidAuthButton
          source={ThreepidSource.discord}
          type="primary"
          icon={<DiscordIcon />}
          state={{ redirect: router.asPath }}
        >
          {" "}
          Join using Discord roles
        </ThreepidAuthButton>
      );
    }

    return (
      <Button type="primary" icon={<DiscordIcon />} onClick={handleJoin}>
        Join using Discord roles
      </Button>
    );
  })();

  return (
    <Alert
      message="There are projects that are gated by Discord roles from this DAO's server"
      type="info"
      style={style}
      description={button}
      showIcon
    />
  );
};
