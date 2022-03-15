import React, { FC } from "react";
import { ProjectPrivateAlert } from "./ProjectPrivateAlert";

interface Props {
  projectId: string;
  organizationId: string;
}

export const ProjectRBAC: FC<Props> = ({ projectId, organizationId }) => {
  return (
    <ProjectPrivateAlert
      projectId={projectId}
      organizationId={organizationId}
    />
  );
};
