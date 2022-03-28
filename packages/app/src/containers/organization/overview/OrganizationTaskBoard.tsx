import React, { FC } from "react";
import { TaskBoard } from "../../task/board/TaskBoard";
import { useOrganizationTasks } from "../hooks";
import { SkeletonTaskBoard } from "../../task/board/SkeletonTaskBoard";

interface Props {
  organizationId: string;
}

export const OrganizationTaskBoard: FC<Props> = ({ organizationId }) => {
  const organization = useOrganizationTasks(
    organizationId,
    undefined,
    "cache-and-network"
  );

  return organization ? (
    <TaskBoard tasks={organization.tasks} />
  ) : (
    <SkeletonTaskBoard />
  );
};
