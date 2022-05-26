import React, { FC, useCallback, useMemo, useRef } from "react";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import _ from "lodash";
import { Table, Space, Row, Typography, Button } from "antd";
import {
  Role,
  ThreepidSource,
  UserWithRoles,
  GetOrganizationContributorsQuery,
  GetOrganizationContributorsQueryVariables,
} from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { RoleTag } from "@dewo/app/components/RoleTag";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useLazyQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import { useRunning } from "@dewo/app/util/hooks";
import { useOrganizationUsersWithRoles } from "../hooks";

interface Props {
  organizationId: string;
}

interface ExportProps {
  organizationId: string;
}

const OrganizationContributorExports: FC<ExportProps> = ({
  organizationId,
}) => {
  const csvRef = useRef<any>();
  const [fetchContributors, { data }] = useLazyQuery<
    GetOrganizationContributorsQuery,
    GetOrganizationContributorsQueryVariables
  >(Queries.organizationContributors, { variables: { organizationId } });
  const headers = useMemo(
    () => [
      { label: "Username", key: "username" },
      { label: "Wallet address", key: "address" },
      { label: "Roles", key: "roles" },
    ],
    []
  );

  const csvData = useMemo(() => {
    const sortedUsers = _.orderBy(
      data?.organization?.users,
      (user) =>
        user.roles.filter(
          (role) =>
            !role.userId &&
            role.organizationId === organizationId &&
            !role.fallback
        ).length,
      "desc"
    );

    return sortedUsers.map((user) => ({
      username: user.username,
      address:
        user.threepids.find((t) => t.source === ThreepidSource.metamask)
          ?.address ??
        user.threepids.find((t) => t.source === ThreepidSource.phantom)
          ?.address,
      roles: user.roles
        .filter(
          (r) => !r.userId && r.organizationId === organizationId && !r.fallback
        )
        .map((role) => role.name)
        .join(", "),
    }));
  }, [data, organizationId]);

  const [handleExport, exporting] = useRunning(
    useCallback(async () => {
      await fetchContributors({
        variables: { organizationId: organizationId! },
      });
      csvRef.current?.link?.click();
    }, [fetchContributors, organizationId])
  );

  return (
    <>
      <Button
        icon={<ExportOutlined />}
        loading={exporting}
        onClick={handleExport}
        name="Export organization contributors as CSV"
      >
        Export as CSV
      </Button>
      {!!csvData.length && (
        <CSVLink
          ref={csvRef}
          filename="organization-contributors.csv"
          data={csvData}
          headers={headers}
        />
      )}
    </>
  );
};

export const OrganizationContributorList: FC<Props> = ({ organizationId }) => {
  const { users } = useOrganizationUsersWithRoles(organizationId);
  const navigateToProfile = useNavigateToProfile();
  const canUpdateOrganization = usePermission("update", "Organization");
  const sortedUsers = useMemo(() => {
    return _.orderBy(
      users,
      (user) =>
        user.roles.filter(
          (role) =>
            !role.userId &&
            role.organizationId === organizationId &&
            !role.fallback
        ).length,
      "desc"
    );
  }, [users, organizationId]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        All Contributors
      </Typography.Title>
      <Table<UserWithRoles>
        dataSource={sortedUsers}
        size="small"
        pagination={{ hideOnSinglePage: true }}
        onRow={(user) => ({ onClick: () => navigateToProfile(user) })}
        style={{ cursor: "pointer", marginBottom: 30 }}
        columns={[
          {
            key: "avatar",
            width: 1,
            render: (_, user) => <UserAvatar user={user} />,
          },
          { title: "Username", dataIndex: "username" },
          {
            title: "Roles",
            dataIndex: "roles",
            render: (roles: Role[]) => (
              <Row style={{ rowGap: 4 }}>
                {roles
                  .filter(
                    (role) =>
                      !role.userId &&
                      role.organizationId === organizationId &&
                      !role.fallback
                  )
                  .map((role) => (
                    <RoleTag key={role.id} role={role} />
                  ))}
              </Row>
            ),
          },
          // {
          //   title: "Projects",
          //   dataIndex: "projects",
          //   render: (_, user: User) => (
          //     <Row style={{ marginBottom: -4 }}>
          //       {projectsByUserId[user.id]?.map((p) => (
          //         <Link key={p.id} href={p.permalink}>
          //           <a onClick={stopPropagation} style={{ marginBottom: 4 }}>
          //             <Tag color={colorNameFromUuid(p.id)}>{p.name}</Tag>
          //           </a>
          //         </Link>
          //       ))}
          //     </Row>
          //   ),
          // },
        ]}
      />
      {canUpdateOrganization && (
        <OrganizationContributorExports organizationId={organizationId} />
      )}
    </Space>
  );
};
