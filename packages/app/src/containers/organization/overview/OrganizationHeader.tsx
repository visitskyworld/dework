import { useRouter } from "next/router";
import {
  Input,
  Menu,
  PageHeader,
  Row,
  Skeleton,
  Typography,
  Modal,
} from "antd";
import React, { FC, useMemo, useCallback, useEffect, useState } from "react";
import { useOrganization, useUpdateOrganization } from "../hooks";

import Link from "next/link";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { PageHeaderBreadcrumbs } from "../../navigation/PageHeaderBreadcrumbs";
import { JoinOrganizationButton } from "./JoinOrganizationButton";
import { useToggle } from "@dewo/app/util/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

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
  const [organizationName, setOrganizationName] = useState("");
  const editName = useToggle();
  const canEdit = usePermission("update", "Organization");
  const updateOrganization = useUpdateOrganization();
  const loading = !organization;
  const canDeleteOrganization = usePermission("delete", "Organization");
  const router = useRouter();

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

  const submitOrganizationName = useCallback(async () => {
    await updateOrganization({ id: organizationId, name: organizationName });
    editName.toggleOff();
  }, [editName, organizationId, organizationName, updateOrganization]);

  const handleChange = useCallback(async (e: any) => {
    setOrganizationName(e.target.value);
  }, []);

  useEffect(() => {
    if (!!organization) setOrganizationName(organization.name);
  }, [organization]);

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
          !editName.isOn ? (
            <Typography.Title
              level={3}
              style={{ margin: 0 }}
              onClick={editName.toggleOn}
            >
              {organization.name}
            </Typography.Title>
          ) : (
            <Input
              disabled={!canEdit}
              autoFocus={true}
              className="ant-input dewo-field dewo-field-display ant-typography-h3"
              placeholder="Enter a organization name..."
              onBlur={editName.toggleOff}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  submitOrganizationName();
                }
              }}
              onChange={handleChange}
              value={organizationName}
            />
          )
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
