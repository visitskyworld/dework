import React, { FC } from "react";
import { useOrganizationUsers } from "../hooks";
import { Table, Space, Row } from "antd";
import { Role, UserWithRoles } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { RoleTag } from "@dewo/app/components/RoleTag";

interface Props {
  organizationId: string;
}

export const OrganizationContributorList: FC<Props> = ({ organizationId }) => {
  const { users } = useOrganizationUsers(organizationId);
  const navigateToProfile = useNavigateToProfile();

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", paddingLeft: 16, paddingRight: 16 }}
    >
      <Table<UserWithRoles>
        dataSource={users}
        size="small"
        pagination={{ hideOnSinglePage: true }}
        onRow={(user) => ({ onClick: () => navigateToProfile(user) })}
        style={{ cursor: "pointer" }}
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
    </Space>
  );
};
