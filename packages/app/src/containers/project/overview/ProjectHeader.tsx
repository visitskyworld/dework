import { Avatar, PageHeader, Row, Skeleton, Typography } from "antd";
import React, { FC, useMemo } from "react";
import _ from "lodash";
import { useProject, useUpdateProject } from "../hooks";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useOrganization } from "../../organization/hooks";
import { InviteButton } from "../../invite/InviteButton";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";
import { JoinOrganizationButton } from "../../organization/overview/JoinOrganizationButton";

interface Props {
  projectId: string;
}

export const ProjectHeader: FC<Props> = ({ projectId }) => {
  const project = useProject(projectId);
  const organization = useOrganization(project?.organizationId);
  const updateProject = useUpdateProject();

  const routes = useMemo(
    () =>
      !!organization &&
      !!project && [
        {
          path: "../..",
          breadcrumbName: "Home",
        },
        {
          path: `o/${organization.slug}`,
          breadcrumbName: organization.name,
        },
        {
          path: `p/${project.slug}`,
          breadcrumbName: project.name,
          children: [{ path: "settings", breadcrumbName: "Settings" }],
        },
      ],
    [organization, project]
  ) as Route[];

  const editProject = _.debounce((text: string | null) => {
    updateProject({
      id: projectId,
      name: text,
    });
  }, 500);

  return (
    <PageHeader
      title={
        !!project ? (
          <Typography.Title level={3} style={{ margin: 0 }}>
            <div
              contentEditable="true"
              onInput={(e) => editProject(e.currentTarget.textContent)}
            >
              {project.name}
            </div>
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
            <InviteButton
              organizationId={project?.organizationId}
              projectId={projectId}
            />
            <JoinOrganizationButton organizationId={project?.organizationId} />
          </Row>
        ) : (
          <Skeleton.Avatar active size="large" />
        )
      }
      breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
    />
  );
};
