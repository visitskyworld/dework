import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Menu,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { useOrganization } from "../hooks";
import { JoinTokenGatedProjectsButton } from "../../invite/JoinTokenGatedProjectsButton";
import {
  ProjectDetails,
  ProjectSection,
  ProjectVisibility,
} from "@dewo/app/graphql/types";
import { useRouter } from "next/router";

import { CreateSectionPopover } from "./CreateSectionPopover";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import Link from "next/link";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface Props {
  organizationId: string;
}

const defaultProjectSection: ProjectSection = {
  id: "default",
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

  const canCreateProject = usePermission("create", "Project");
  const canCreateProjectSection = usePermission("create", "ProjectSection");
  const shouldRenderSection = useCallback(
    (section: ProjectSection) =>
      section.id === defaultProjectSection.id ||
      !!projectsBySectionId[section.id]?.length ||
      canCreateProject,
    [projectsBySectionId, canCreateProject]
  );

  if (typeof window === "undefined") return null;
  return (
    <>
      <JoinTokenGatedProjectsButton organizationId={organizationId} />

      {/* <DragDropContext onDragEnd={() => alert("dragen")}>
        <Droppable droppableId="123">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.filter(shouldRenderSection).map((section, iIndex) => (
                  <>
                    {["red", "green", "blue", "yellow"].map((j, jIndex) => (
                      <Draggable
                        draggableId={[section.id, j].join(":")}
                        index={iIndex * 4 + jIndex}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div
                              style={{
                                width: 100,
                                height: 100,
                                backgroundColor: j,
                              }}
                            >
                              {iIndex * 4 + jIndex}}: {section.id}, {j}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext> */}

      <DragDropContext onDragEnd={() => alert("dragen")}>
        {sections.filter(shouldRenderSection).map((section) => (
          <>
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
              {(canCreateProject || canCreateProjectSection) && (
                <Dropdown
                  trigger={["click"]}
                  placement="bottomLeft"
                  overlay={
                    <Menu>
                      {canCreateProject && (
                        <>
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
                        </>
                      )}
                      {canCreateProjectSection && (
                        <CreateSectionPopover organizationId={organizationId}>
                          <Menu.Item>Create a section</Menu.Item>
                        </CreateSectionPopover>
                      )}
                    </Menu>
                  }
                >
                  <Button
                    type="text"
                    icon={<Icons.PlusOutlined />}
                    className="text-secondary"
                  />
                </Dropdown>
              )}
            </Space>
            <Droppable droppableId={section.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {!collapsed[section.id] &&
                    projectsBySectionId[section.id]?.map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                        isDragDisabled={!canCreateProject}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Link href={project.permalink}>
                              <a>
                                <Card
                                  size="small"
                                  className="hover:component-highlight"
                                  style={{ padding: 8 }}
                                >
                                  <Row style={{ alignItems: "center" }}>
                                    <Typography.Title
                                      level={5}
                                      style={{ marginBottom: 0 }}
                                    >
                                      {project.visibility ===
                                        ProjectVisibility.PRIVATE && (
                                        <Typography.Text type="secondary">
                                          <Icons.LockOutlined />
                                          {"  "}
                                        </Typography.Text>
                                      )}
                                      {project.name}
                                    </Typography.Title>
                                    {!!project.openBountyTaskCount && (
                                      <Tag
                                        className="bg-primary"
                                        style={{ marginLeft: 16 }}
                                      >
                                        {project.openBountyTaskCount === 1
                                          ? "1 open bounty"
                                          : `${project.openBountyTaskCount} open bounties`}
                                      </Tag>
                                    )}
                                    <div style={{ flex: 1 }} />
                                    <Avatar.Group maxCount={10}>
                                      {project.members.map((member) => (
                                        <UserAvatar
                                          key={member.id}
                                          user={member.user}
                                          linkToProfile
                                        />
                                      ))}
                                    </Avatar.Group>
                                  </Row>
                                </Card>
                                <div style={{ paddingBottom: 8 }} />
                              </a>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </>
        ))}
      </DragDropContext>
    </>
  );
};
