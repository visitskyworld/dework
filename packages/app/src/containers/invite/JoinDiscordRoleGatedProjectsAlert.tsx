import { Alert } from "antd";
import React, { CSSProperties, FC, useMemo } from "react";
import { useOrganization } from "../organization/hooks";
import { ProjectIntegrationType } from "@dewo/app/graphql/types";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import _ from "lodash";
import { DiscordRoleGatingJoinButton } from "./DiscordRoleGatingJoinButton";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

interface Props {
  organizationId: string;
  style?: CSSProperties;
}

export const JoinDiscordRoleGatedProjectsAlert: FC<Props> = ({
  organizationId,
  style,
}) => {
  const { user } = useAuthContext();
  const { organization } = useOrganization(organizationId);
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
        organization?.projects
          .filter((p) => p.members.some((m) => m.userId === user?.id))
          .map((p) => p.id) ?? []
      ).length,
    [projectIdsWithDiscordRoleGates, organization?.projects, user?.id]
  );

  const canAccessAllProjects = usePermission("update", "Project");
  if (canAccessAllProjects || !canJoinProjectWithDiscordRole) {
    return null;
  }

  return (
    <Alert
      message="There are projects that are gated by Discord roles from this DAO's server"
      type="info"
      style={style}
      description={
        <DiscordRoleGatingJoinButton
          type="primary"
          organizationId={organizationId}
        >
          Join using Discord roles
        </DiscordRoleGatingJoinButton>
      }
      showIcon
    />
  );
};
