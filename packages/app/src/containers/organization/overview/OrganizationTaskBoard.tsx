import _ from "lodash";
import React, { FC, useMemo } from "react";
import { TaskBoard } from "../../project/board/TaskBoard";
import { useOrganizationTasks } from "../hooks";

interface Props {
  organizationId: string;
}

export const OrganizationTaskBoard: FC<Props> = ({ organizationId }) => {
  const organization = useOrganizationTasks(organizationId);
  const taskTags = useMemo(
    () =>
      _(organization?.projects)
        .map((p) => p.taskTags)
        .flatten()
        .value(),
    [organization?.projects]
  );
  if (!organization) return null;
  return <TaskBoard tasks={organization.tasks} tags={taskTags} />;
};
