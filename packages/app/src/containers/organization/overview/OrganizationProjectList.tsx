import { Button, Col, Dropdown, Menu, Row, Space } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useOrganization } from "../hooks";
import { ProjectCard } from "./ProjectCard";
import { JoinTokenGatedProjectsButton } from "../../invite/JoinTokenGatedProjectsButton";
import { ProjectDetails } from "@dewo/app/graphql/types";
import { useRouter } from "next/router";

import { CreateSectionPopover } from "./CreateSectionPopover";

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

  const router = useRouter();
  const navigateToProjectCreate = useCallback(
    () => router.push(`${organization?.permalink}/create`),
    [router, organization?.permalink]
  );

  return (
    <>
      <JoinTokenGatedProjectsButton organizationId={organizationId} />

      {sections.map((section) => (
        <div key={section.id}>
          <Space size={16} style={{ marginBottom: 4 }}>
            <Button
              type="text"
              size="large"
              icon={
                collapsed[section.id] ? (
                  <Icons.CaretUpFilled className="text-secondary" />
                ) : (
                  <Icons.CaretDownFilled className="text-secondary" />
                )
              }
              style={{ flex: "unset" }}
              className="dewo-btn-highlight font-bold"
              onClick={() => collapseSection(section.id)}
            >
              {section.title}
            </Button>
            <Dropdown
              trigger={["click"]}
              placement="bottomLeft"
              overlay={
                <Menu>
                  <Menu.Item onClick={navigateToProjectCreate}>
                    Create a project
                  </Menu.Item>
                  <Menu.SubMenu title="Import from Notion/Trello">
                    <Menu.Item>3rd menu item</Menu.Item>
                    <Menu.Item>4th menu item</Menu.Item>
                  </Menu.SubMenu>
                  <CreateSectionPopover>
                    <Menu.Item>Create a section</Menu.Item>
                  </CreateSectionPopover>
                </Menu>
              }
            >
              <Button
                type="text"
                icon={<Icons.PlusOutlined />}
                className="text-secondary"
              />
            </Dropdown>
          </Space>
          {!collapsed[section.id] && (
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
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
    </>
  );
};
