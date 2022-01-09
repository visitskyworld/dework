import React, { FC } from "react";
import { TaskBoard } from "../../task/board/TaskBoard";
import { useOrganizationTasks } from "../hooks";

interface Props {
  organizationId: string;
}

export const OrganizationTaskBoard: FC<Props> = ({ organizationId }) => {
  const organization = useOrganizationTasks(
    organizationId,
    "cache-and-network"
  );
  if (!organization) return null;
  return <TaskBoard tasks={organization.tasks} />;
};
