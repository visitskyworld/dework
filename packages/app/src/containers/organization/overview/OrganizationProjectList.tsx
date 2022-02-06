import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Menu,
  Progress,
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
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { useUpdateProject } from "../../project/hooks";
import { getSortKeyBetween } from "../../task/board/util";
import _ from "lodash";

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
    () => _.sortBy(organization?.projects, (p) => p.sortKey),
    [organization?.projects]
  );

  const sections = useMemo(
    () => [defaultProjectSection, ...(organization?.projectSections ?? [])],
    [organization?.projectSections]
  );

  // Note(fant): hide project section if user cannot create channel

  const projectsBySectionId = useMemo(
    () =>
      projects.reduce((acc, p) => {
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

  const updateProject = useUpdateProject();
  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    async (result) => {
      if (!projects) return;
      if (result.reason !== "DROP" || !result.destination) return;

      const projectId = result.draggableId;
      const sectionId = result.destination.droppableId;
      const org = projects.find((p) => p.id === projectId);
      if (!org) return;

      const indexExcludingItself = (() => {
        const newIndex = result.destination.index;
        const oldIndex = result.source.index;
        // To get the items above and below the currently dropped card
        // we need to offset the new index by 1 if the card was dragged
        // from above in the same lane. The card we're dragging from
        // above makes all other items move up one step
        if (oldIndex < newIndex) return newIndex + 1;
        return newIndex;
      })();

      const orgAbove = projects[indexExcludingItself - 1];
      const orgBelow = projects[indexExcludingItself];
      const sortKey = getSortKeyBetween(orgAbove, orgBelow, (p) => p.sortKey);

      console.warn(sortKey);

      await updateProject({
        sortKey,
        id: projectId,
        sectionId: sectionId === defaultProjectSection.id ? null : sectionId,
      });
    },
    [projects, updateProject]
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

      <DragDropContext onDragEnd={handleDragEnd}>
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
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  // style={{
                  //   ...provided.droppableProps,
                  //   minHeight: 90,
                  // }}
                >
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
                                    <Row style={{ flex: 1 }}>
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
                                    </Row>
                                    <div style={{ flex: 1 }} />
                                    <Progress
                                      size="small"
                                      percent={
                                        !!project.taskCount
                                          ? (project.doneTaskCount /
                                              project.taskCount) *
                                            100
                                          : undefined
                                      }
                                      showInfo={false}
                                      style={{ flex: 1 }}
                                    />
                                    <Avatar.Group
                                      size="small"
                                      maxCount={5}
                                      style={{
                                        width: 104,
                                        marginLeft: 16,
                                        justifyContent: "flex-end",
                                      }}
                                    >
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
                  {/* {!collapsed[section.id] &&
                    !projectsBySectionId[section.id]?.length && (
                      <Typography.Text type="secondary">
                        Add project by pressing + or drag and drop
                      </Typography.Text>
                    )} */}
                  {/* <div style={{ marginBottom: 16 }} /> */}
                </div>
              )}
            </Droppable>
          </>
        ))}
      </DragDropContext>
    </>
  );
};
