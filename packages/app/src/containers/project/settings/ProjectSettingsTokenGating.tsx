import {
  PaymentToken,
  ProjectDetails,
  ProjectVisibility,
} from "@dewo/app/graphql/types";
import { Divider, Typography } from "antd";
import React, { FC, useCallback } from "react";
import {
  useCreateProjectTokenGate,
  useDeleteProjectTokenGate,
  useUpdateProject,
} from "../hooks";
import { ProjectSettingsTokenGatingInput } from "./ProjectSettingsTokenGatingInput";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsTokenGating: FC<Props> = ({ project }) => {
  const tokenGate = project.tokenGates[0];
  const createProjectTokenGate = useCreateProjectTokenGate();
  const deleteProjectTokenGate = useDeleteProjectTokenGate();
  const updateProject = useUpdateProject();

  const handleChangeTokenGating = useCallback(
    async (token: PaymentToken | undefined) => {
      if (!!token && !tokenGate) {
        await createProjectTokenGate({
          projectId: project.id,
          tokenId: token.id,
        });
        if (project.visibility !== ProjectVisibility.PRIVATE) {
          await updateProject({
            id: project.id,
            visibility: ProjectVisibility.PRIVATE,
          });
        }
      } else {
        await deleteProjectTokenGate({
          projectId: project.id,
          tokenId: tokenGate.token.id,
        });
      }
    },
    [
      tokenGate,
      createProjectTokenGate,
      project.id,
      project.visibility,
      updateProject,
      deleteProjectTokenGate,
    ]
  );

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Token Gating
      </Typography.Title>

      <Divider style={{ marginTop: 0 }} />

      <ProjectSettingsTokenGatingInput
        value={tokenGate?.token ?? undefined}
        onChange={handleChangeTokenGating}
      />
    </>
  );
};
