import { Col, Row, Space } from "antd";
import React, { FC, useMemo } from "react";
import { useOrganization } from "../hooks";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectCard } from "./CreateProjectCard";
import { Can } from "@dewo/app/contexts/PermissionsContext";
import { JoinTokenGatedProjectsButton } from "../../invite/JoinTokenGatedProjectsButton";
import { ImportProjectsCard } from "./ImportProjectsCard";

interface Props {
  organizationId: string;
}

export const OrganizationProjectList: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganization(organizationId);
  const projects = useMemo(
    () => organization?.projects.filter((p) => !p.deletedAt),
    [organization?.projects]
  );
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <JoinTokenGatedProjectsButton organizationId={organizationId} />
      <Row gutter={[16, 16]}>
        {projects?.map((project) => (
          <Col key={project.id} xs={24} sm={12} md={8}>
            <ProjectCard project={project} />
          </Col>
        ))}
        <Can I="create" a="Project">
          {[CreateProjectCard, ImportProjectsCard].map((Component) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              style={{ paddingLeft: 8, paddingRight: 8 }}
            >
              <Component organizationId={organizationId} />
            </Col>
          ))}
        </Can>
      </Row>
    </Space>
  );
};
