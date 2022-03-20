import { RoleTag } from "@dewo/app/components/RoleTag";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { RoleSource, ThreepidSource } from "@dewo/app/graphql/types";
import { Alert, Row } from "antd";
import React, { FC, useMemo } from "react";
import { ConnectUsingDiscordRolesButton } from "../auth/ConnectUsingDiscordRolesButton";
import { useOrganizationRoles } from "../rbac/hooks";

interface Props {
  organizationId: string;
}

export const DiscordRoleGateAlert: FC<Props> = ({ organizationId }) => {
  const { user } = useAuthContext();
  const roles = useOrganizationRoles(organizationId);
  const rolesFromDiscordWithRules = useMemo(
    () =>
      roles?.filter((r) => r.source === RoleSource.DISCORD && !!r.rules.length),
    [roles]
  );
  const isConnectedToDiscord = useMemo(
    () => user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user]
  );

  if (!rolesFromDiscordWithRules) return null;
  if (!rolesFromDiscordWithRules?.length) return null;
  if (isConnectedToDiscord) return null;
  return (
    <Alert
      message="The following Discord roles give you access to permissions and private projects in this organization. Connect with Discord to get access."
      type="info"
      description={
        <>
          <Row style={{ marginBottom: 16, rowGap: 4 }}>
            {rolesFromDiscordWithRules
              ?.filter((role) => role.source === RoleSource.DISCORD)
              .map((role) => (
                <RoleTag key={role.id} role={role} />
              ))}
          </Row>
          <ConnectUsingDiscordRolesButton
            type="primary"
            organizationId={organizationId}
            children="Connect with Discord"
          />
        </>
      }
      showIcon
    />
  );
};
