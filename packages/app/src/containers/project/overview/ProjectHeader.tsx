import { Avatar, PageHeader, Row, Skeleton, Typography } from "antd";
import React, { FC, useMemo } from "react";
import { useProject } from "../hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useOrganization } from "../../organization/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { InviteButton } from "../../invite/InviteButton";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";

interface Props {
  projectId: string;
}

export const ProjectHeader: FC<Props> = ({ projectId }) => {
  const project = useProject(projectId);
  const organization = useOrganization(project?.organizationId);
  const canAddMember = usePermission("create", "OrganizationMember");

  const routes = useMemo(
    () =>
      !!organization &&
      !!project && [
        {
          path: "../../",
          breadcrumbName: "Home",
        },
        {
          path: `/organization/${organization.id}`,
          breadcrumbName: organization.name,
        },
        {
          path: `/project/${project.id}`,
          breadcrumbName: project.name,
          children: [{ path: "settings", breadcrumbName: "Settings" }],
        },
      ],
    [organization, project]
  ) as Route[];

  return (
    <PageHeader
      title={
        !!project ? (
          <Typography.Title level={3} style={{ margin: 0 }}>
            {project.name}
          </Typography.Title>
        ) : (
          <Skeleton.Button active style={{ width: 200 }} />
        )
      }
      subTitle={
        !!project ? (
          <Row align="middle">
            <Avatar.Group maxCount={3} size="large">
              {organization?.members.map((m) => (
                <UserAvatar key={m.id} user={m.user} linkToProfile />
              ))}
            </Avatar.Group>

            <div style={{ width: 24 }} />
            {canAddMember && (
              <InviteButton
                organizationId={project?.organizationId}
                projectId={projectId}
              />
            )}
          </Row>
        ) : (
          <Skeleton.Avatar active size="large" />
        )
      }
      breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
    />
  );
};
