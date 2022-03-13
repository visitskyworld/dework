import { Row, Skeleton, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useOrganization } from "../../hooks";
import * as Icons from "@ant-design/icons";
import { JoinTokenGatedProjectsAlert } from "../../../invite/JoinTokenGatedProjectsAlert";
import { ProjectDetails, ProjectSection } from "@dewo/app/graphql/types";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { useUpdateProject } from "../../../project/hooks";
import { getSortKeyBetween } from "../../../task/board/util";
import _ from "lodash";
import { ProjectListRow } from "./ProjectListRow";
import { ProjectSectionOptionsButton } from "./ProjectSectionOptionsButton";
import { CreateProjectButton } from "../CreateProjectButton";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { ProjectListEmpty } from "./ProjectListEmpty";
import { JoinDiscordRoleGatedProjectsAlert } from "@dewo/app/containers/invite/JoinDiscordRoleGatedProjectsAlert";

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
  const screens = useBreakpoint();
  const { organization } = useOrganization(organizationId);
  const projects = useMemo(
    () => _.sortBy(organization?.projects, (p) => p.sortKey),
    [organization?.projects]
  );

  const sections = useMemo(
    () => [defaultProjectSection, ...(organization?.projectSections ?? [])],
    [organization?.projectSections]
  );

  const projectsBySectionId = useMemo(
    () =>
      projects.reduce((acc, p) => {
        const sectionId = p.sectionId ?? defaultProjectSection.id;
        return { ...acc, [sectionId]: [...(acc[sectionId] ?? []), p] };
      }, {} as Record<string, ProjectDetails[]>) ?? {},
    [projects]
  );

  const canCreateProject = usePermission("create", "Project");
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
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      const indexExcludingItself = (() => {
        const newIndex = result.destination.index;
        const oldIndex = result.source.index;
        // To get the items above and below the currently dropped card
        // we need to offset the new index by 1 if the card was dragged
        // from above in the same lane. The card we're dragging from
        // above makes all other items move up one step
        if (
          result.source.droppableId === result.destination.droppableId &&
          oldIndex < newIndex
        )
          return newIndex + 1;
        return newIndex;
      })();

      const above = projectsBySectionId[sectionId]?.[indexExcludingItself - 1];
      const below = projectsBySectionId[sectionId]?.[indexExcludingItself];
      const sortKey = getSortKeyBetween(above, below, (p) => p.sortKey);

      await updateProject({
        sortKey,
        id: projectId,
        sectionId: sectionId === defaultProjectSection.id ? null : sectionId,
      });
    },
    [projects, projectsBySectionId, updateProject]
  );

  if (!organization) return <Skeleton />;
  if (typeof window === "undefined") return null;
  return (
    <div
      style={screens.sm ? { maxHeight: "100vh", height: "100%" } : undefined}
    >
      <JoinDiscordRoleGatedProjectsAlert
        organizationId={organizationId}
        style={{ marginBottom: 16 }}
      />
      <JoinTokenGatedProjectsAlert
        organizationId={organizationId}
        style={{ marginBottom: 16 }}
      />

      {!projects.length ? (
        <ProjectListEmpty organizationId={organizationId} />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          {sections.filter(shouldRenderSection).map((section) => (
            <>
              <Row align="middle" style={{ marginBottom: 4 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {section.name}
                </Typography.Title>
                <ProjectSectionOptionsButton
                  section={section}
                  isDefault={section.id === defaultProjectSection.id}
                  organizationId={organizationId}
                />
                {canCreateProject && section.id === defaultProjectSection.id && (
                  <>
                    <div style={{ flex: 1 }} />
                    <CreateProjectButton
                      organizationId={organizationId}
                      type="primary"
                      size="small"
                      icon={<Icons.PlusOutlined />}
                    >
                      Create Project
                    </CreateProjectButton>
                  </>
                )}
              </Row>
              <Droppable droppableId={section.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {projectsBySectionId[section.id]?.map((project, index) => (
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
                            <ProjectListRow project={project} />
                            <div style={{ paddingBottom: 8 }} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Row style={{ height: 36 }}>
                      {!projectsBySectionId[section.id]?.length &&
                        canCreateProject && (
                          <Typography.Text type="secondary">
                            Drag projects into this section
                          </Typography.Text>
                        )}
                    </Row>
                  </div>
                )}
              </Droppable>
            </>
          ))}
        </DragDropContext>
      )}
    </div>
  );
};
