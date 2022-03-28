import { Col, Row, Skeleton, Space, Typography } from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "@ant-design/icons";
import { JoinTokenGatedProjectsAlert } from "../../../invite/JoinTokenGatedProjectsAlert";
import { OrganizationDetails, ProjectSection } from "@dewo/app/graphql/types";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import _ from "lodash";
import { ProjectListRow } from "./ProjectListRow";
import { ProjectSectionOptionsButton } from "./ProjectSectionOptionsButton";
import { CreateProjectButton } from "../CreateProjectButton";
import { ProjectListEmpty } from "./ProjectListEmpty";
import { useOrganizationDetails } from "../../hooks";
import { DiscordRoleGateAlert } from "@dewo/app/containers/invite/DiscordRoleGateAlert";

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
  const { organization } = useOrganizationDetails(organizationId);
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
      }, {} as Record<string, OrganizationDetails["projects"]>) ?? {},
    [projects]
  );

  const canCreateProject = usePermission("create", {
    __typename: "Project",
    organizationId,
  });
  const canCreateProjectSection = usePermission("create", "ProjectSection");
  const shouldRenderSection = useCallback(
    (section: ProjectSection) =>
      section.id === defaultProjectSection.id ||
      !!projectsBySectionId[section.id]?.length ||
      canCreateProjectSection,
    [projectsBySectionId, canCreateProjectSection]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Skeleton
      loading={!mounted || !organization || typeof window === "undefined"}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <DiscordRoleGateAlert organizationId={organizationId} />
        <JoinTokenGatedProjectsAlert organizationId={organizationId} />

        {!projects.length ? (
          <ProjectListEmpty organizationId={organizationId} />
        ) : (
          sections.filter(shouldRenderSection).map((section) => (
            <div>
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
              <Row gutter={[8, 8]}>
                {projectsBySectionId[section.id]?.map((project) => (
                  <Col key={project.id} xs={24} sm={12} xl={8} xxl={6}>
                    <ProjectListRow project={project} sections={sections} />
                  </Col>
                ))}
              </Row>

              {!projectsBySectionId[section.id]?.length && (
                <Typography.Text type="secondary">
                  This section is empty
                </Typography.Text>
              )}
            </div>
          ))
        )}
      </Space>
    </Skeleton>
  );
};
