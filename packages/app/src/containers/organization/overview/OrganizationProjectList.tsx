import { Col, Layout, Row } from "antd";
import React, { FC } from "react";
import { useOrganization } from "../hooks";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectCard } from "./CreateProjectCard";

interface Props {
  organizationId: string;
}

export const OrganizationProjectList: FC<Props> = ({ organizationId }) => {
  const organization = useOrganization(organizationId);
  return (
    <Layout.Content
      className="max-w-lg"
      style={{ paddingLeft: 16, paddingRight: 16 }}
    >
      <Row gutter={[16, 16]}>
        {organization?.projects.map((project) => (
          <Col key={project.id} span={8}>
            <ProjectCard
              project={project}
              users={organization?.members.map((m) => m.user) ?? []}
            />
          </Col>
        ))}
        <Col span={8} style={{ paddingLeft: 8, paddingRight: 8 }}>
          <CreateProjectCard organizationId={organizationId} />
        </Col>
      </Row>
    </Layout.Content>
  );
};
