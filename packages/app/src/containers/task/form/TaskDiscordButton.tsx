import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { OpenDiscordButton } from "@dewo/app/components/OpenDiscordButton";
import {
  DiscordGuildMembershipState,
  ProjectIntegrationType,
  TaskDetails,
} from "@dewo/app/graphql/types";
import { Constants } from "@dewo/app/util/constants";
import { Button, message } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback } from "react";
import {
  useAddUserToDiscordGuild,
  useDiscordGuildMembershipState,
} from "../../integrations/hooks";
import { useProjectIntegrations } from "../../project/hooks";
import { useCreateTaskDiscordLink } from "../hooks";

interface Props {
  task: TaskDetails;
}

export const TaskDiscordButton: FC<Props> = ({ task }) => {
  const router = useRouter();

  const integrations = useProjectIntegrations(task.projectId);
  const membershipState = useDiscordGuildMembershipState(
    task.project.organizationId
  );
  const addUserToDiscordGuild = useAddUserToDiscordGuild(
    task.project.organizationId
  );
  const createDiscordLink = useCreateTaskDiscordLink();
  const handleCreateDiscordLink = useCallback(async () => {
    try {
      if (membershipState === DiscordGuildMembershipState.HAS_SCOPE) {
        await addUserToDiscordGuild().catch(() => {});
      }
      return createDiscordLink(task.id);
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message);
      }
      throw e;
    }
  }, [addUserToDiscordGuild, createDiscordLink, task.id, membershipState]);

  if (!membershipState) return null;
  if (!integrations?.some((i) => i.type === ProjectIntegrationType.DISCORD)) {
    return null;
  }

  if (membershipState === DiscordGuildMembershipState.MISSING_SCOPE) {
    return (
      <Button
        type="primary"
        size="small"
        icon={<DiscordIcon />}
        href={`${
          Constants.GRAPHQL_API_URL
        }/auth/discord-join-guild?state=${encodeURIComponent(
          encodeURIComponent(JSON.stringify({ redirect: router.asPath }))
        )}`}
      >
        Discuss
      </Button>
    );
  }

  return (
    <OpenDiscordButton
      type="primary"
      size="small"
      href={handleCreateDiscordLink}
    >
      Discuss
    </OpenDiscordButton>
  );
};
