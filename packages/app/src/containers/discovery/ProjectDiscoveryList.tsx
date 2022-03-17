import React, { FC, useEffect, useState } from "react";
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
import { stopPropagation } from "@dewo/app/util/eatClick";

type ProjectRow = GetFeaturedProjectsQuery["projects"][number];

export const ProjectDiscoveryList: FC = () => {
  const projects = useQuery<GetFeaturedProjectsQuery>(Queries.featuredProjects)
    .data?.projects;
  const router = useRouter();
  const screens = useBreakpoint();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
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
                    <a onClick={stopPropagation}>
                      <OrganizationAvatar
                        organization={project.organization}
                        size={64}
                        tooltip={{ title: "View DAO profile" }}
                      />
                    </a>
                  </Link>
                ),
                defaultSortOrder: "descend" as "descend",
                showSorterTooltip: false,
                sorter: (a: ProjectRow, b: ProjectRow) =>
                  5 *
                    (a.organization.users.length -
                      b.organization.users.length) +
                  1 * (a.taskCount - b.taskCount),
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
                      <span style={{ fontWeight: 400 }}>
                        {`${project.organization.name} / `}
                      </span>
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
                          {project.organization.users.map((u) => (
                            <UserAvatar key={u.id} user={u} linkToProfile />
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
                        a.organization.users.length -
                        b.organization.users.length,
                      render: (_: unknown, project: ProjectRow) => (
                        <Avatar.Group maxCount={5} size="small">
                          {project.organization.users.map((u) => (
                            <UserAvatar key={u.id} user={u} linkToProfile />
                          ))}
                        </Avatar.Group>
                      ),
                    },
                    {
                      key: "tasks",
                      title: "Tasks",
                      width: 140,
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
