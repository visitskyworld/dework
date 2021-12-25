import { useRouter } from "next/router";
import { Menu, PageHeader, Row, Skeleton, Typography, Modal } from "antd";
import React, { FC, useMemo, useCallback } from "react";
import { useOrganization } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

import Link from "next/link";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";
import { JoinOrganizationButton } from "./JoinOrganizationButton";

import { useUpdateOrganization } from "../hooks";

const { confirm } = Modal;

export enum OrganizationHeaderTab {
  projects = "projects",
  board = "board",
  members = "members",
  deleteOrganization = "deleteOrganization",
}

const titleByTab: Record<OrganizationHeaderTab, string> = {
  [OrganizationHeaderTab.projects]: "Projects",
  [OrganizationHeaderTab.board]: "Board",
  [OrganizationHeaderTab.members]: "Members",
  [OrganizationHeaderTab.deleteOrganization]: "Delete Organization",
};

interface Props {
  organizationId: string;
  tab: OrganizationHeaderTab;
}

export const OrganizationHeader: FC<Props> = ({ organizationId, tab }) => {
  const organization = useOrganization(organizationId);
  const loading = !organization;
  const canDeleteOrganization = usePermission("delete", "Organization");
  const router = useRouter();

  const updateOrganization = useUpdateOrganization();
  const deleteOrganization = useCallback(async () => {
    try {
      await updateOrganization({
        id: organizationId,
        deletedAt: new Date().toISOString(),
      });
      await router.push("/");
    } catch (err) {}
  }, [updateOrganization, organizationId, router]);

  const showConfirmDeleteOrganization = useCallback(() => {
    confirm({
      title: "Do you want to delete organization?",
      onOk: () => {
        deleteOrganization();
      },
    });
  }, [deleteOrganization]);

  const routes = useMemo(
    () =>
      !!organization && [
        {
          path: "..",
          breadcrumbName: "Home",
        },
        {
          path: `o/${organization.slug}`,
          breadcrumbName: organization.name,
        },
      ],
    [organization]
  ) as Route[];

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
      breadcrumb={<PageHeaderBreadcrumbs routes={routes} />}
      tags={
        <Skeleton
          loading={loading}
          active
          paragraph={false}
          title={{ width: 200 }}
        >
          <Row align="middle">
            <Menu mode="horizontal" selectedKeys={[tab]}>
              {[
                OrganizationHeaderTab.projects,
                OrganizationHeaderTab.board,
                OrganizationHeaderTab.members,
              ].map((tab) => (
                <Menu.Item key={tab}>
                  <Link
                    href={organization ? `/o/${organization.slug}/${tab}` : ""}
                  >
                    <a>{titleByTab[tab]}</a>
                  </Link>
                </Menu.Item>
              ))}
              {canDeleteOrganization && (
                <Menu.Item
                  onClick={showConfirmDeleteOrganization}
                  key={OrganizationHeaderTab.deleteOrganization}
                >
                  {titleByTab["deleteOrganization"]}
                </Menu.Item>
              )}
            </Menu>
            <JoinOrganizationButton organizationId={organizationId} />
          </Row>
        </Skeleton>
      }
    />
  );
};
