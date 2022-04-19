import React, { FC, useEffect, useState, useMemo } from "react";
import { Spin, Table, Typography } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import * as Queries from "@dewo/app/graphql/queries";
import { useQuery } from "@apollo/client";
import {
  GetOrganizationsUserFollowsOnDiscordQuery,
  Organization,
} from "@dewo/app/graphql/types";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { FollowOrganizationButton } from "@dewo/app/containers/organization/overview/FollowOrganizationButton";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

function useOrganizationsUserFollowsOnDiscord(): Organization[] | undefined {
  const { data } = useQuery<GetOrganizationsUserFollowsOnDiscordQuery>(
    Queries.organizationsUserFollowsOnDiscord
  );
  return data?.organizations;
}

export const RecommendedDAOsList: FC = () => {
  const { user } = useAuthContext();
  const organizations = useOrganizationsUserFollowsOnDiscord();
  const router = useRouter();
  const screens = useBreakpoint();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filteredOrganizations = useMemo(
    () =>
      organizations?.filter((organization) => {
        return !user?.organizations?.some((o) => o.id === organization.id);
      }),
    [user, organizations]
  );

  if (!mounted) return null;
  return (
    <>
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        Recommended DAOs{" "}
        {!!filteredOrganizations && `(${filteredOrganizations.length})`}
      </Typography.Title>
      {!!filteredOrganizations ? (
        <div className="mx-auto max-w-md w-full">
          <Table
            dataSource={filteredOrganizations}
            pagination={{ hideOnSinglePage: true }}
            size="small"
            rowClassName="hover:cursor-pointer"
            className="dewo-discovery-table"
            rowKey="id"
            onRow={(o) => ({ onClick: () => router.push(o.permalink) })}
            showHeader={false}
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
                    {!screens.md && (
                      <FollowOrganizationButton
                        organizationId={organization.id}
                      />
                    )}
                  </>
                ),
              },
              ...(screens.md
                ? [
                    {
                      key: "follow",
                      width: 1,
                      render: (_: unknown, organization: Organization) => (
                        <FollowOrganizationButton
                          organizationId={organization.id}
                          style={{ marginRight: 20 }}
                        />
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
