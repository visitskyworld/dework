import React, { FC } from "react";
import { useOrganizationUsers } from "../hooks";
import { Table, Space, Row, Tag } from "antd";
import { Role, RoleSource, UserWithRoles } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

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
              <Row>
                {roles
                  .filter((role) => !role.userId)
                  .map(
                    (role) =>
                      role.organizationId === organizationId && (
                        <Tag key={role.id} color={role.color}>
                          {role.source === RoleSource.DISCORD && (
                            <DiscordIcon style={{ marginRight: 4 }} />
                          )}
                          {role.name}
                        </Tag>
                      )
                  )}
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
