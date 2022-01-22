import { FormSection } from "@dewo/app/components/FormSection";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { ProjectIntegrationType, TaskDetails } from "@dewo/app/graphql/types";
import { Button } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useProject } from "../../project/hooks";
import { useCreateTaskDiscordLink } from "../hooks";

interface Props {
  task: TaskDetails;
}

export const TaskDiscordButton: FC<Props> = ({ task }) => {
  const project = useProject(task.projectId);
  const [loading, setLoading] = useState(false);

  const createDiscordLink = useCreateTaskDiscordLink();
  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      const link = await createDiscordLink(task.id);
      window.open(link, "_blank");
    } finally {
      setLoading(false);
    }
  }, [createDiscordLink, task.id]);

  if (!project) return null;
  if (
    !project.integrations.some((i) => i.type === ProjectIntegrationType.DISCORD)
  ) {
    return null;
  }
  return (
    <FormSection label="Discord" className="mb-3">
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
    </FormSection>
  );
};
