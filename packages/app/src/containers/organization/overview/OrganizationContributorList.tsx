import React, { FC, useMemo } from "react";
import { useOrganization, useOrganizationContributors } from "../hooks";
import { Table, Space, Row, Tag } from "antd";
import { OrganizationRole, User } from "@dewo/app/graphql/types";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import _ from "lodash";
import { organizationRoleToString } from "./OrganizationMemberList";
import Link from "next/link";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { colorNameFromUuid } from "@dewo/app/util/colorFromUuid";

interface Props {
  organizationId: string;
}

export const OrganizationContributorList: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganization(organizationId);
  const contributors = useOrganizationContributors(organizationId);
  const projectsByUserId = useMemo(
    () =>
      _(contributors)
        .keyBy((user) => user.id)
        .mapValues((user) =>
          organization?.projects.filter((p) =>
            p.members.some((m) => m.userId === user.id)
          )
        )
        .value(),
    [organization?.projects, contributors]
  );

  const navigateToProfile = useNavigateToProfile();

  const organizationRoleByUserId = useMemo(
    () =>
      _(organization?.members)
        .keyBy((m) => m.user.id)
        .mapValues((m) =>
          m.role === OrganizationRole.FOLLOWER ? undefined : m.role
        )
        .value(),
    [organization?.members]
  );

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", paddingLeft: 16, paddingRight: 16 }}
    >
      <Table<User>
        dataSource={contributors}
        size="small"
        pagination={{ hideOnSinglePage: true }}
        onRow={(user) => ({ onClick: () => navigateToProfile(user) })}
        style={{ cursor: "pointer" }}
        columns={[
          {
            key: "avatar",
            width: 1,
            render: (_, user: User) => <UserAvatar user={user} />,
          },
          { title: "Username", dataIndex: "username" },
          {
            title: "Projects",
            dataIndex: "projects",
            render: (_, user: User) => (
              <Row style={{ marginBottom: -4 }}>
                {projectsByUserId[user.id]?.map((p) => (
                  <Link key={p.id} href={p.permalink}>
                    <a onClick={stopPropagation} style={{ marginBottom: 4 }}>
                      <Tag color={colorNameFromUuid(p.id)}>{p.name}</Tag>
                    </a>
                  </Link>
                ))}
              </Row>
            ),
          },
          {
            title: "Role",
            dataIndex: "role",
            width: 1,
            render: (_, user: User) => {
              const role = organizationRoleByUserId[user.id];
              if (!role) return "Contributor";
              return organizationRoleToString[role];
            },
          },
        ]}
      />
    </Space>
  );
};
