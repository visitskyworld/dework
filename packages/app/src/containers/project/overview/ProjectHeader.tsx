import { Avatar, PageHeader, Skeleton, Typography } from "antd";
import React, { FC } from "react";
import { useProject } from "../hooks";
import Link from "next/link";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useOrganization } from "../../organization/hooks";

interface Props {
  projectId: string;
}

export const ProjectHeader: FC<Props> = ({ projectId }) => {
  const project = useProject(projectId);
  const organization = useOrganization(project?.organizationId);
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
          <Avatar.Group maxCount={3} size="large">
            {organization?.members.map((m, index) => (
              <Link href={`/profile/${m.user.id}`}>
                <a>
                  <UserAvatar
                    key={m.id}
                    user={m.user}
                    style={index !== 0 ? { marginLeft: -24 } : undefined}
                  />
                </a>
              </Link>
            ))}
          </Avatar.Group>
        ) : (
          <Skeleton.Avatar active size="large" />
        )
      }
      breadcrumb={
        !!project && !!organization ? (
          {
            routes: [
              {
                path: `organization/${organization.id}`,
                breadcrumbName: organization.name,
              },
              {
                path: `project/${project.id}`,
                breadcrumbName: project.name,
              },
            ],
            itemRender(route, _params, routes, paths) {
              const last = routes.indexOf(route) === routes.length - 1;
              return last ? (
                <span>{route.breadcrumbName}</span>
              ) : (
                <Link href={["", paths].join("/")}>{route.breadcrumbName}</Link>
              );
            },
          }
        ) : (
          <Skeleton loading active title={false} paragraph={{ rows: 1 }} />
        )
      }
    />
  );
};
