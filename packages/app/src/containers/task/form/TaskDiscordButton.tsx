import { FormSection } from "@dewo/app/components/FormSection";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import {
  DiscordGuildMembershipState,
  ProjectIntegrationType,
  TaskDetails,
} from "@dewo/app/graphql/types";
import { Constants } from "@dewo/app/util/constants";
import { Button, message, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import {
  useAddUserToDiscordGuild,
  useDiscordGuildMembershipState,
} from "../../integrations/hooks";
import { useProject } from "../../project/hooks";
import { useCreateTaskDiscordLink } from "../hooks";

interface Props {
  task: TaskDetails;
}

export const TaskDiscordButton: FC<Props> = ({ task }) => {
  const router = useRouter();
  const { project } = useProject(task.projectId);
  const [loading, setLoading] = useState(false);

  const membershipState = useDiscordGuildMembershipState(
    project?.organizationId
  );
  const addUserToDiscordGuild = useAddUserToDiscordGuild(
    task.project.organizationId
  );
  const createDiscordLink = useCreateTaskDiscordLink();
  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      if (membershipState === DiscordGuildMembershipState.HAS_SCOPE) {
        await addUserToDiscordGuild().catch();
      }
      let link = await createDiscordLink(task.id);
      if (link) {
        window.open(link, "_blank");
      }
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [createDiscordLink, task.id, addUserToDiscordGuild, membershipState]);

  if (!project || !membershipState) return null;
  if (
    !project.integrations.some((i) => i.type === ProjectIntegrationType.DISCORD)
  ) {
    return null;
  }
  return (
    <FormSection label="Discord" className="mb-3">
      {membershipState === DiscordGuildMembershipState.MISSING_SCOPE ? (
        <>
          <Typography.Paragraph>
            To join the discussion you need to first join our Discord server
          </Typography.Paragraph>
          <Button
            type="primary"
            size="small"
            icon={<DiscordIcon />}
            href={`${
              Constants.GRAPHQL_API_URL
            }/auth/discord-join-guild?state=${JSON.stringify({
              redirect: router.asPath,
            })}`}
          >
            Go to Discord thread
          </Button>
        </>
      ) : (
        <Button
          type="primary"
          target="_blank"
          size="small"
          loading={loading}
          icon={<DiscordIcon />}
          onClick={handleClick}
        >
          Go to Discord thread
        </Button>
      )}
    </FormSection>
  );
};
