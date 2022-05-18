import React, { FC, useMemo } from "react";
import { Button, Col, Row, Skeleton, Space, Typography } from "antd";
import {
  useOrganizationDetails,
  useOrganizationSections,
} from "../organization/hooks";
import * as Icons from "@ant-design/icons";
import { BlockButton } from "@dewo/app/components/BlockButton";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { CreateProjectButton } from "../organization/overview/CreateProjectButton";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { SidenavHeader } from "./SidenavHeader";
import { useIsProjectPrivate } from "../rbac/hooks";
import { Organization, Project, ProjectSection } from "@dewo/app/graphql/types";

const ProjectButton: FC<{ project: Project }> = ({ project }) => {
  const isPrivate = useIsProjectPrivate(project, project.organizationId);
  return (
    <BlockButton
      href={project.permalink}
      icon={isPrivate ? <Icons.LockOutlined /> : null}
      title={project.name}
    >
      <Typography.Text ellipsis>{project.name}</Typography.Text>
    </BlockButton>
  );
};

const NavSkeleton = () => {
  return (
    <>
      <Space direction="horizontal" className="w-full" style={{ padding: 16 }}>
        <Skeleton.Avatar active />
        <Col flex={1}>
          <Skeleton.Button active style={{ width: 130, minWidth: 0 }} />
        </Col>
      </Space>
      <Skeleton active style={{ paddingRight: 16, paddingLeft: 16 }} />
    </>
  );
};

const Sections: FC<{
  sections: (ProjectSection & { projects: Project[] })[];
  organization: Organization;
}> = ({ sections, organization }) => {
  const canCreateProject = usePermission("create", {
    __typename: "Project",
    organizationId: organization.id,
  });

  const rendered = useMemo(() => {
    return sections.map(
      (section) =>
        section.projects.length > 0 && (
          <Row key={section.id}>
            <Row className="w-full" align="middle">
              <Button
                type="text"
                className="text-secondary font-bold ant-typography-caption"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  pointerEvents: "none", // disable button hover effects
                  paddingLeft: 6,
                }}
              >
                {section.name}
              </Button>
              <Col flex={1} />
              {!!canCreateProject && (
                <CreateProjectButton
                  organizationId={organization.id}
                  type="text"
                  size="small"
                  className="text-secondary"
                  icon={<Icons.PlusOutlined />}
                  sectionId={section.id}
                />
              )}
            </Row>
            <Space direction="vertical" className="w-full" size={2}>
              {section.projects.map((project) => (
                <ProjectButton key={project.id} project={project} />
              ))}
            </Space>
          </Row>
        )
    );
  }, [canCreateProject, organization.id, sections]);

  return (
    <Space className="pr-2 pl-2 mb-3 w-full" direction="vertical" size="middle">
      {rendered}
    </Space>
  );
};

export const OrganizationSidenav: FC<{ organizationId?: string }> = ({
  organizationId,
}) => {
  const { organization } = useOrganizationDetails(organizationId);
  const sections = useOrganizationSections(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");

  if (!organization) return <NavSkeleton />;

  return (
    <>
      <SidenavHeader
        icon={<OrganizationAvatar organization={organization} />}
        href={organization.permalink}
        title={organization.name}
      />
      <Space direction="vertical" className="pl-2 pr-2 mb-3 w-full" size={2}>
        <BlockButton
          icon={<Icons.AppstoreOutlined />}
          href={organization.permalink}
          exact
        >
          Overview
        </BlockButton>
        <BlockButton
          icon={<Icons.TeamOutlined />}
          href={`${organization.permalink}/contributors`}
        >
          Contributors
        </BlockButton>
        <BlockButton
          icon={<Icons.ProjectOutlined />}
          href={`${organization.permalink}/board`}
        >
          Combined board
        </BlockButton>
        {!!canUpdateOrganization && (
          <BlockButton
            icon={<Icons.SettingOutlined />}
            href={`${organization.permalink}/settings`}
          >
            Settings
          </BlockButton>
        )}
      </Space>

      <Sections organization={organization} sections={sections} />
    </>
  );
};
