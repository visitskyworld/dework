import React, { FC, useEffect, useMemo, useState } from "react";
import * as Queries from "@dewo/app/graphql/queries";
import { useQuery } from "@apollo/client";
import { GetPopularOrganizationsQuery } from "@dewo/app/graphql/types";
import { Avatar, Row, Spin, Table, Typography } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { stopPropagation } from "@dewo/app/util/eatClick";
import _ from "lodash";

type OrganizationRow = GetPopularOrganizationsQuery["organizations"][number];

function usePopularOrganizations():
  | GetPopularOrganizationsQuery["organizations"]
  | undefined {
  const { data } = useQuery<GetPopularOrganizationsQuery>(
    Queries.popularOrganizations
  );
  return useMemo(() => {
    if (!data) return undefined;
    return _.sortBy(data?.organizations, (o) => o.users.length).reverse();
  }, [data]);
}

export const ProjectDiscoveryList: FC = () => {
  const organizations = usePopularOrganizations();
  const router = useRouter();
  const screens = useBreakpoint();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <>
      <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
        Popular DAOs {!!organizations && `(${organizations.length})`}
      </Typography.Title>
      {!!organizations ? (
        <div className="mx-auto max-w-md w-full">
          <Table
            dataSource={organizations}
            pagination={{ hideOnSinglePage: true }}
            size="small"
            tableLayout="fixed"
            rowClassName="hover:cursor-pointer"
            className="dewo-discovery-table"
            rowKey="id"
            onRow={(o) => ({ onClick: () => router.push(o.permalink) })}
            columns={[
              {
                key: "organization",
                width: 64 + 8 * 2,
                render: (_: unknown, organization) => (
                  <Link href={organization.permalink}>
                    <a onClick={stopPropagation}>
                      <OrganizationAvatar
                        organization={organization}
                        size={64}
                        tooltip={{ title: "View DAO profile" }}
                      />
                    </a>
                  </Link>
                ),
              },
              {
                key: "name",
                render: (_: unknown, organization) => (
                  <>
                    <Typography.Title
                      level={5}
                      ellipsis={{ rows: 1 }}
                      style={{ margin: 0 }}
                    >
                      <span style={{ fontWeight: 400 }}>
                        {`${organization.name} / `}
                      </span>
                      {organization.name}
                    </Typography.Title>
                    {!!organization.tagline && (
                      <Typography.Paragraph
                        type="secondary"
                        ellipsis={{ rows: 3 }}
                        style={{ margin: 0 }}
                      >
                        {organization.tagline}
                      </Typography.Paragraph>
                    )}
                    {!screens.sm && (
                      <Row style={{ marginTop: 8, marginBottom: 8 }}>
                        <Avatar.Group maxCount={5} size="small">
                          {organization.users.map((u) => (
                            <UserAvatar key={u.id} user={u} linkToProfile />
                          ))}
                        </Avatar.Group>
                      </Row>
                    )}
                  </>
                ),
                showSorterTooltip: false,
                sorter: (a: OrganizationRow, b: OrganizationRow) =>
                  a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
              },
              ...(screens.sm
                ? [
                    {
                      key: "contributors",
                      title: "Contributors",
                      width: 140,
                      sorter: (a: OrganizationRow, b: OrganizationRow) =>
                        a.users.length - b.users.length,
                      render: (_: unknown, organization: OrganizationRow) => (
                        <Avatar.Group maxCount={5} size="small">
                          {organization.users.map((u) => (
                            <UserAvatar key={u.id} user={u} linkToProfile />
                          ))}
                        </Avatar.Group>
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
