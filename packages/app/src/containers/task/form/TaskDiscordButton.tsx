import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import {
  DiscordGuildMembershipState,
  ProjectIntegrationType,
  TaskDetails,
} from "@dewo/app/graphql/types";
import { Constants } from "@dewo/app/util/constants";
import { Button, Dropdown, Menu, message } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const integrations = useProjectIntegrations(task.projectId);
  const membershipState = useDiscordGuildMembershipState(
    task.project.organizationId
  );
  const addUserToDiscordGuild = useAddUserToDiscordGuild(
    task.project.organizationId
  );
  const createDiscordLink = useCreateTaskDiscordLink();
  const handleClick = useCallback(
    async (openInApp: boolean) => {
      setLoading(true);
      try {
        if (membershipState === DiscordGuildMembershipState.HAS_SCOPE) {
          await addUserToDiscordGuild().catch();
        }
        const link = await createDiscordLink(task.id);
        if (openInApp) {
          window.open(link.replace(/^https:\/\//, "discord://"), "_blank");
        } else {
          window.open(link, "_blank");
        }
      } catch (e) {
        if (e instanceof Error) {
          message.error(e.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [createDiscordLink, task.id, addUserToDiscordGuild, membershipState]
  );

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
          JSON.stringify({ redirect: router.asPath })
        )}`}
      >
        Go to Discord thread
      </Button>
    );
  }

  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <Menu>
          <Menu.Item onClick={() => handleClick(false)}>Discord Web</Menu.Item>
          <Menu.Item onClick={() => handleClick(true)}>Discord App</Menu.Item>
        </Menu>
      }
    >
      <Button
        type="primary"
        target="_blank"
        size="small"
        loading={loading}
        icon={<DiscordIcon />}
      >
        Go to Discord thread
      </Button>
    </Dropdown>
  );
};
