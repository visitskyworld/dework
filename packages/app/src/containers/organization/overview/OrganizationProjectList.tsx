import { Button, Col, Dropdown, Menu, Row, Space } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useOrganization } from "../hooks";
import { ProjectCard } from "./ProjectCard";
import { JoinTokenGatedProjectsButton } from "../../invite/JoinTokenGatedProjectsButton";
import { ProjectDetails, ProjectSection } from "@dewo/app/graphql/types";
import { useRouter } from "next/router";

import { CreateSectionPopover } from "./CreateSectionPopover";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";

interface Props {
  organizationId: string;
}

const defaultProjectSection: ProjectSection = {
  id: "",
  name: "Projects",
  sortKey: "1",
  __typename: "ProjectSection",
};

export const OrganizationProjectList: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganization(organizationId);
  const projects = useMemo(
    () => organization?.projects.filter((p) => !p.deletedAt),
    [organization?.projects]
  );

  const sections = useMemo(
    () => [defaultProjectSection, ...(organization?.projectSections ?? [])],
    [organization?.projectSections]
  );

  // Note(fant): hide project section if user cannot create channel

  const projectsBySectionId = useMemo(
    () =>
      projects?.reduce((acc, p) => {
        const sectionId = p.sectionId ?? defaultProjectSection.id;
        return { ...acc, [sectionId]: [...(acc[sectionId] ?? []), p] };
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
          <Space style={{ marginBottom: 4 }}>
            <Button
              type="text"
              size="large"
              // icon={
              //   collapsed[section.id] ? (
              //     <Icons.CaretUpFilled className="text-secondary" />
              //   ) : (
              //     <Icons.CaretDownFilled className="text-secondary" />
              //   )
              // }
              style={{ flex: "unset" }}
              className="dewo-btn-highlight font-bold"
              onClick={() => collapseSection(section.id)}
            >
              {section.name}
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
                    <Menu.Item icon={<NotionIcon />}>
                      Import from Notion
                    </Menu.Item>
                    <Menu.Item icon={<TrelloIcon />}>
                      Import from Trello
                    </Menu.Item>
                  </Menu.SubMenu>
                  <CreateSectionPopover organizationId={organizationId}>
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
