import { ProjectDetails, ProjectTokenGate } from "@dewo/app/graphql/types";
import { Alert, Divider, Space, Typography } from "antd";
import React, { FC, useCallback } from "react";
import { useDeleteProjectTokenGate } from "../hooks";
import { CreateProjectTokenGate } from "./CreateProjectTokenGate";
import { projectRoleToString } from "./strings";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsTokenGating: FC<Props> = ({ project }) => {
  const deleteProjectTokenGate = useDeleteProjectTokenGate();
  const handleDeleteTokenGate = useCallback(
    async (tokenGate: ProjectTokenGate) => {
      await deleteProjectTokenGate({
        projectId: project.id,
        tokenId: tokenGate.token.id,
        role: tokenGate.role,
      });
    },
    [deleteProjectTokenGate, project.id]
  );

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Token Gating
      </Typography.Title>
      <Divider style={{ marginTop: 0 }} />

      <Space direction="vertical" style={{ width: "100%", marginBottom: 24 }}>
        {project.tokenGates.map((tokenGate) => (
          <Alert
            message={`Users with ${tokenGate.token.name} (${
              tokenGate.token.symbol
            }) in their wallets can join this project as ${
              projectRoleToString[tokenGate.role]
            }`}
            type="success"
            showIcon
            closable
            onClose={() => handleDeleteTokenGate(tokenGate)}
          />
        ))}
      </Space>

      <CreateProjectTokenGate
        key={project.tokenGates.length}
        project={project}
      />
    </>
  );
};
