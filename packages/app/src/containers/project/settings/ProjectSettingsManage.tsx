import { ProjectDetails } from "@dewo/app/graphql/types";
import { Divider, Typography } from "antd";
import React, { FC } from "react";
import { ProjectSettingsDangerZone } from "./ProjectSettingsDangerZone";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsManage: FC<Props> = ({ project }) => {
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Manage
      </Typography.Title>

      <Divider style={{ marginTop: 0 }} />

      <ProjectSettingsDangerZone project={project} />
    </>
  );
};
