import { ProjectDetails } from "@dewo/app/graphql/types";
import { Divider, Typography } from "antd";
import React, { FC } from "react";
import { ProjectInviteButton } from "../../invite/ProjectInviteButton";
import { ProjectSettingsMemberList } from "./ProjectSettingsMemberList";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsMembers: FC<Props> = ({ project }) => (
  <>
    <Typography.Title level={4} style={{ marginBottom: 4 }}>
      Members
    </Typography.Title>

    <Divider style={{ marginTop: 0 }} />

    <ProjectSettingsMemberList projectId={project.id} />
    <ProjectInviteButton projectId={project.id} style={{ marginTop: 8 }} />
  </>
);
