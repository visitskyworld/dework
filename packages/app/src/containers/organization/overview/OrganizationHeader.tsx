import { Menu, PageHeader, Skeleton, Typography } from "antd";
import React, { FC } from "react";
import { useOrganization } from "../hooks";
import Link from "next/link";

export enum OrganizationHeaderTab {
  projects = "projects",
  board = "board",
  members = "members",
}

const titleByTab: Record<OrganizationHeaderTab, string> = {
  [OrganizationHeaderTab.projects]: "Projects",
  [OrganizationHeaderTab.board]: "Board",
  [OrganizationHeaderTab.members]: "Members",
};

interface Props {
  organizationId: string;
  tab: OrganizationHeaderTab;
}

export const OrganizationHeader: FC<Props> = ({ organizationId, tab }) => {
  const organization = useOrganization(organizationId);
  const loading = !organization;

  return (
    <PageHeader
      title={
        !!organization ? (
          <Typography.Title level={3} style={{ margin: 0 }}>
            {organization.name}
          </Typography.Title>
        ) : (
          <Skeleton.Button active style={{ width: 200 }} />
        )
      }
      tags={
        <Skeleton
          loading={loading}
          active
          paragraph={false}
          title={{ width: 200 }}
        >
          <Menu mode="horizontal" selectedKeys={[tab]}>
            {[
              OrganizationHeaderTab.projects,
              OrganizationHeaderTab.board,
              OrganizationHeaderTab.members,
            ].map((tab) => (
              <Menu.Item key={tab}>
                <Link href={`/organization/${organizationId}/${tab}`}>
                  <a>{titleByTab[tab]}</a>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Skeleton>
      }
    />
  );
};
