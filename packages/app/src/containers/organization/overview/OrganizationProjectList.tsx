import { Button, Col, Row, Space } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useOrganization } from "../hooks";
import { ProjectCard } from "./ProjectCard";
import { JoinTokenGatedProjectsButton } from "../../invite/JoinTokenGatedProjectsButton";
import { ProjectDetails } from "@dewo/app/graphql/types";

interface Props {
  organizationId: string;
}

interface ProjectSection {
  id: string;
  title: string;
}

const sections: ProjectSection[] = [
  { id: "1", title: "Projects" },
  { id: "2", title: "Smth else" },
];

export const OrganizationProjectList: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganization(organizationId);
  const projects = useMemo(
    () => organization?.projects.filter((p) => !p.deletedAt),
    [organization?.projects]
  );

  const projectsBySectionId = useMemo(
    () =>
      projects?.reduce((acc, p) => {
        // const section = sections.find((s) => s.id === p.sectionId) ?? sections[sections.length - 1];
        const section = sections[Math.floor(sections.length * Math.random())];
        return { ...acc, [section.id]: [...(acc[section.id] ?? []), p] };
      }, {} as Record<string, ProjectDetails[]>) ?? {},
    [projects]
  );

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const collapseSection = useCallback(
    (sectionId: string) =>
      setCollapsed((prev) => ({ ...prev, [sectionId]: !prev[sectionId] })),
    []
  );

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <JoinTokenGatedProjectsButton organizationId={organizationId} />

      {sections.map((section) => (
        <div key={section.id}>
          <Button
            type="text"
            size="large"
            icon={
              collapsed[section.id] ? (
                <Icons.CaretUpFilled />
              ) : (
                <Icons.CaretDownFilled />
              )
            }
            className="dewo-btn-highlight font-bold"
            onClick={() => collapseSection(section.id)}
          >
            {section.title}
          </Button>
          {!collapsed[section.id] && (
            <Row gutter={[16, 16]}>
              {projectsBySectionId[section.id]?.map((project) => (
                <Col key={project.id} xs={24} sm={12} md={8}>
                  <ProjectCard project={project} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      ))}

      {/* <Row gutter={[16, 16]}>
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
      </Row> */}
    </Space>
  );
};
