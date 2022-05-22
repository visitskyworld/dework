import React, { FC } from "react";
import { Col, Menu, Row, Skeleton, Space } from "antd";
import {
  useOrganizationDetails,
  useOrganizationWorkspaces,
} from "../../organization/hooks";
import * as Icons from "@ant-design/icons";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { CreateProjectButton } from "../../organization/overview/CreateProjectButton";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { MenuHeader } from "./MenuHeader";
import styles from "./Menu.module.less";
import { useRouter } from "next/router";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { useIsProjectPrivateFn } from "../../rbac/hooks";

const NavSkeleton = () => {
  return (
    <>
      <Space direction="horizontal" className="w-full" style={{ padding: 16 }}>
        <Skeleton.Avatar active />
        <Col flex={1}>
          <Skeleton.Button active style={{ width: 130, minWidth: 0 }} />
        </Col>
      </Space>
      <Skeleton active style={{ paddingRight: 16, paddingLeft: 16 }} />
    </>
  );
};

export const OrganizationMenu: FC<{ organizationId?: string }> = ({
  organizationId,
}) => {
  const { organization } = useOrganizationDetails(organizationId);
  const workspaces = useOrganizationWorkspaces(organizationId);
  const isProjectPrivate = useIsProjectPrivateFn(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");

  const router = useRouter();

  const canCreateProject = usePermission("create", {
    __typename: "Project",
    organizationId: organizationId!,
  });

  if (!organization) return <NavSkeleton />;
  const basePath = new URL(organization.permalink).pathname;
  const overviewKey = "overview";
  return (
    <>
      <MenuHeader
        icon={<OrganizationAvatar organization={organization} />}
        href={organization.permalink}
        title={organization.name}
      />
      <Menu
        inlineCollapsed
        className={styles.menu}
        activeKey={router.asPath === basePath ? overviewKey : router.asPath}
        onSelect={({ key }) =>
          key === overviewKey ? router.push(basePath) : router.push(key)
        }
        items={[
          {
            label: "Overview",
            icon: <Icons.AppstoreOutlined />,
            key: overviewKey,
          },
          {
            label: "Contributors",
            icon: <Icons.TeamOutlined />,
            key: [basePath, "contributors"].join("/"),
          },
          {
            label: "Combined Board",
            icon: <Icons.TeamOutlined />,
            key: [basePath, "board"].join("/"),
          },
          canUpdateOrganization
            ? {
                label: "Settings",
                icon: <Icons.SettingOutlined />,
                key: [basePath, "settings"].join("/"),
              }
            : null,
          ...workspaces.map(
            (workspace): ItemType => ({
              type: "group",
              label: (
                <Row align="middle" justify="space-between">
                  {workspace.name}
                  {!!canCreateProject && (
                    <CreateProjectButton
                      organizationId={organization.id}
                      type="text"
                      size="small"
                      className="text-secondary"
                      icon={<Icons.PlusOutlined />}
                      workspaceId={workspace.id}
                    />
                  )}
                </Row>
              ),
              children: workspace.projects.map((project) => ({
                icon: isProjectPrivate(project) ? (
                  <Icons.LockOutlined />
                ) : undefined,
                label: project.name,
                key: new URL(project.permalink).pathname,
              })),
            })
          ),
        ]}
      />
    </>
  );
};
