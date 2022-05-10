import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Queries from "@dewo/app/graphql/queries";
import { useQuery } from "@apollo/client";
import { GetPopularOrganizationsQuery } from "@dewo/app/graphql/types";
import { Spin, Table, Typography, Input, Tag } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { stopPropagation } from "@dewo/app/util/eatClick";
import _ from "lodash";
import { SearchOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import styles from "./ProjectDiscoveryList.module.less";

type OrganizationRow = GetPopularOrganizationsQuery["organizations"][number];

function usePopularOrganizations():
  | GetPopularOrganizationsQuery["organizations"]
  | undefined {
  const { data } = useQuery<GetPopularOrganizationsQuery>(
    Queries.popularOrganizations,
    { ssr: false }
  );
  return useMemo(() => {
    if (!data) return undefined;
    return _.sortBy(data?.organizations, (o) => -o.userCount);
  }, [data]);
}

export const ProjectDiscoveryList: FC = () => {
  const organizations = usePopularOrganizations();
  const router = useRouter();
  const screens = useBreakpoint();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [searchText, setSearchText] = useState("");
  const onChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value),
    []
  );
  const filteredOrganizations = useMemo(
    () =>
      organizations?.filter((organization) =>
        organization.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [searchText, organizations]
  );
  if (!mounted) return null;
  return (
    <>
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        🌍 Popular DAOs{" "}
        {!!filteredOrganizations && `(${filteredOrganizations.length})`}
      </Typography.Title>
      {!!filteredOrganizations ? (
        <div className="mx-auto max-w-md w-full">
          <Input
            placeholder="Search DAOs..."
            allowClear
            onChange={onChangeSearch}
            prefix={<SearchOutlined />}
            size="large"
            className={styles.searchbar}
          />
          <Table
            dataSource={filteredOrganizations}
            pagination={{ hideOnSinglePage: true }}
            size="small"
            tableLayout="fixed"
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
                render: (__: unknown, organization) => (
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
                    {!screens.sm && (
                      <Tag
                        icon={<UsergroupAddOutlined />}
                        style={{ marginTop: 8, marginBottom: 8 }}
                      >
                        {organization.userCount} members
                      </Tag>
                    )}
                  </>
                ),
              },
              ...(screens.sm
                ? [
                    {
                      key: "contributors",

                      width: 136,
                      render: (__: unknown, organization: OrganizationRow) => (
                        <Tag icon={<UsergroupAddOutlined />}>
                          {organization.userCount} members
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
