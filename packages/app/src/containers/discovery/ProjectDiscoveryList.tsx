import React, { FC } from "react";
import * as Queries from "@dewo/app/graphql/queries";
import * as Icons from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { GetFeaturedProjectsQuery } from "@dewo/app/graphql/types";
import { Avatar, Row, Spin, Table, Tag, Typography } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import removeMarkdown from "remove-markdown";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { UserAvatar } from "@dewo/app/components/UserAvatar";

type ProjectRow = GetFeaturedProjectsQuery["projects"][number];

export const ProjectDiscoveryList: FC = ({}) => {
  const projects = useQuery<GetFeaturedProjectsQuery>(Queries.featuredProjects)
    .data?.projects;
  const router = useRouter();
  const screens = useBreakpoint();
  return (
    <>
      <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
        Popular DAOs and projects {!!projects && `(${projects.length})`}
      </Typography.Title>
      {!!projects ? (
        <div className="mx-auto max-w-md w-full">
          <Table
            dataSource={projects}
            pagination={{ hideOnSinglePage: true }}
            size="small"
            tableLayout="fixed"
            rowClassName="hover:cursor-pointer"
            className="dewo-discovery-table"
            rowKey="id"
            onRow={(p) => ({ onClick: () => router.push(p.permalink) })}
            columns={[
              {
                key: "organization",
                width: 64 + 8 * 2,
                render: (_: unknown, project) => (
                  <Link href={project.organization.permalink}>
                    <a>
                      <OrganizationAvatar
                        organization={project.organization}
                        size={64}
                        tooltip={{ title: "View DAO profile" }}
                      />
                    </a>
                  </Link>
                ),
              },
              {
                key: "name",
                render: (_: unknown, project: ProjectRow) => (
                  <>
                    <Typography.Title
                      level={5}
                      ellipsis={{ rows: 1 }}
                      style={{ margin: 0 }}
                    >
                      {project.name}
                    </Typography.Title>
                    {!!project.description && (
                      <Typography.Paragraph
                        type="secondary"
                        ellipsis={{ rows: 3 }}
                        style={{ margin: 0 }}
                      >
                        {removeMarkdown(project.description)}
                      </Typography.Paragraph>
                    )}
                    {!screens.sm && (
                      <Row style={{ marginTop: 8, marginBottom: 8 }}>
                        <Tag color="green" icon={<Icons.CheckOutlined />}>
                          {project.taskCount} tasks
                        </Tag>
                        <Avatar.Group maxCount={5} size="small">
                          {project.members.map((m) => (
                            <UserAvatar
                              key={m.id}
                              user={m.user}
                              linkToProfile
                            />
                          ))}
                        </Avatar.Group>
                      </Row>
                    )}
                  </>
                ),
              },
              ...(screens.sm
                ? [
                    {
                      key: "contributors",
                      title: "Contributors",
                      width: 140,
                      sorter: (a: ProjectRow, b: ProjectRow) =>
                        a.members.length - b.members.length,
                      render: (_: unknown, project: ProjectRow) => (
                        <Avatar.Group maxCount={5} size="small">
                          {project.members.map((m) => (
                            <UserAvatar
                              key={m.id}
                              user={m.user}
                              linkToProfile
                            />
                          ))}
                        </Avatar.Group>
                      ),
                    },
                    {
                      key: "tasks",
                      title: "Tasks",
                      width: 140,
                      defaultSortOrder: "descend" as "descend",
                      sorter: (a: ProjectRow, b: ProjectRow) =>
                        a.taskCount - b.taskCount,
                      render: (_: unknown, project: ProjectRow) => (
                        <Tag color="green" icon={<Icons.CheckOutlined />}>
                          {project.taskCount} tasks
                        </Tag>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      ) : (
        <div style={{ display: "grid" }}>
          <Spin />
        </div>
      )}
    </>
  );
};
