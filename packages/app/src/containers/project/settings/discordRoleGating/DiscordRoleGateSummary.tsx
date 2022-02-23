import {
  DiscordIntegrationRole,
  ProjectDetails,
  ProjectIntegration,
  ProjectRole,
} from "@dewo/app/graphql/types";
import { Alert, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import {
  useDiscordGuildRoles,
  useUpdateProjectIntegration,
} from "../../../integrations/hooks";
import { projectRoleToString } from "../ProjectSettingsMemberList";

interface Props {
  project: ProjectDetails;
  integration: ProjectIntegration;
}

export const DiscordRoleGateSummary: FC<Props> = ({ project, integration }) => {
  const updateIntegration = useUpdateProjectIntegration();
  const deleteIntegration = useCallback(
    () =>
      updateIntegration({
        id: integration.id,
        deletedAt: new Date().toISOString(),
      }),
    [integration.id, updateIntegration]
  );

  const discordRoles = useDiscordGuildRoles(project.organizationId);
  const roleNames = useMemo(
    () =>
      (integration.config.discordRoleIds as string[])
        .map((id) => discordRoles?.find((r) => r.id === id))
        .filter((r): r is DiscordIntegrationRole => !!r)
        .map((r) => r.name),
    [integration.config.discordRoleIds, discordRoles]
  );
  const projectRoleString =
    projectRoleToString[integration.config.projectRole as ProjectRole];
  return (
    <Alert
      message={
        <>
          <Typography.Text strong>{roleNames.join(", ")}</Typography.Text>
          {" can join this project as "}
          <Typography.Text strong>{projectRoleString}</Typography.Text>
        </>
      }
      type="success"
      showIcon
      closable
      style={{ width: "100%" }}
      onClose={deleteIntegration}
    />
  );
};
