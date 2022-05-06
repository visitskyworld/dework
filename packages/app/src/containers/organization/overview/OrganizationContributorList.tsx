import React, { FC, useMemo } from "react";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useOrganizationUsers } from "../hooks";
import { Table, Space, Row, Typography, Button } from "antd";
import { Role, UserWithRoles } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { RoleTag } from "@dewo/app/components/RoleTag";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

interface Props {
  organizationId: string;
}

interface ExportProps {
  users: UserWithRoles[];
  organizationId: string;
}

const OrganizationContributorExports: FC<ExportProps> = ({
  users,
  organizationId,
}) => {
  const headers = useMemo(
    () => [
      { label: "Username", key: "username" },
      { label: "Wallet address", key: "address" },
      { label: "Roles", key: "roles" },
    ],
    []
  );
  const csvData = useMemo(() => {
    return users.map((user) => ({
      username: user.username,
      roles: user.roles
        .filter(
          (role) =>
            !role.userId &&
            role.organizationId === organizationId &&
            !role.fallback
        )
        .map((role) => role.name)
        .join(", "),
      // address:
      //   user?.threepids.find((t) => t.source === ThreepidSource.metamask)
      //     ?.threepid,
    }));
  }, [users, organizationId]);
  return (
    <CSVLink
      filename="organization-contributors.csv"
      data={csvData}
      headers={headers}
    >
      <Button
        icon={<ExportOutlined />}
        name="Export organization contributors as CSV"
      >
        {"Export as CSV"}
      </Button>
    </CSVLink>
  );
};

export const OrganizationContributorList: FC<Props> = ({ organizationId }) => {
  const { users } = useOrganizationUsers(organizationId);
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
        <OrganizationContributorExports
          users={sortedUsers}
          organizationId={organizationId}
        />
      )}
    </Space>
  );
};
