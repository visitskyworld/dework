import React, { FC, useMemo } from "react";
import { Button, Alert } from "antd";
import { useCurrentUser } from "@dewo/app/util/hooks";
import {
  GetProjectIntegrationsQuery,
  GetProjectIntegrationsQueryVariables,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import { Constants } from "@dewo/app/util/constants";
interface Props {
  organizationId: string;
  projectId: string;
}

export const ProjectDiscordIntegrations: FC<Props> = ({
  organizationId,
  projectId,
}) => {
  const user = useCurrentUser();

  const integrations = useQuery<
    GetProjectIntegrationsQuery,
    GetProjectIntegrationsQueryVariables
  >(Queries.projectIntegrations, { variables: { projectId } }).data?.project
    .integrations;

  const integration = useMemo(
    () => integrations?.find((i) => i.type === ProjectIntegrationType.DISCORD),
    [integrations]
  );

  if (!user) return null;
  if (!!integration) {
    return (
      <Alert
        message={`Connected to Discord (${
          (integration.config as any).guildId
        })`}
        type="success"
        showIcon
        closable
        onClose={() => alert("remove discord integration")}
      />
    );
  }

  return (
    <Button
      size="large"
      type="primary"
      block
      icon={<DiscordIcon />}
      href={`${Constants.GRAPHQL_API_URL}/auth/discord-bot?organizationId=${organizationId}&projectId=${projectId}&userId=${user.id}`}
    >
      Connect Discord
    </Button>
  );
};
