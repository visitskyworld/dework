import React, { FC } from "react";
import { Breadcrumb, Button, Menu, Row } from "antd";
import { useOrganization } from "../../organization/hooks";
import * as Icons from "@ant-design/icons";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { MenuHeader } from "./MenuHeader";
import styles from "./Menu.module.less";
import { useRouter } from "next/router";
import { useIsProjectPrivateFn } from "../../rbac/hooks";
import { MenuSkeleton } from "./MenuSkeleton";
import { CreateProjectButton } from "../../organization/overview/CreateProjectButton";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { WorkspaceDetails } from "@dewo/app/graphql/types";
import Link from "next/link";

interface Props {
  workspace: WorkspaceDetails;
}

export const WorkspaceMenu: FC<Props> = ({ workspace }) => {
  const isProjectPrivate = useIsProjectPrivateFn(workspace.organizationId);
  const organization = useOrganization(workspace.organizationId);

  const router = useRouter();

  const canCreateProject = usePermission("create", {
    __typename: "Project",
    organizationId: workspace.organizationId,
  });

  const basePath = new URL(workspace.permalink).pathname;
  const overviewKey = "board";

  if (!organization) return <MenuSkeleton />;
  return (
    <>
      <MenuHeader
        icon={
          <Link href={organization.permalink}>
            <a>
              <Button
                icon={<Icons.ArrowLeftOutlined />}
                type="text"
                size="small"
              />
            </a>
          </Link>
        }
        href={workspace.permalink}
        title={workspace.name}
        breadcrumb={
          <Breadcrumb style={{ marginBottom: 8 }}>
            <Breadcrumb.Item href={organization.permalink}>
              <OrganizationAvatar
                size={16}
                tooltip={{ visible: false }}
                organization={organization}
                style={{ marginRight: 4 }}
              />
              <span className="text-secondary">{organization.name}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        }
      />
      {/* <div style={{ margin: 8 }}>
        <Button block icon={<Icons.PlusOutlined />} type="ghost">
          Create task
        </Button>
      </div> */}
      <Menu
        mode="inline"
        className={styles.menu}
        defaultOpenKeys={["projects"]}
        activeKey={router.asPath === basePath ? overviewKey : router.asPath}
        onSelect={({ key }) =>
          key === overviewKey ? router.push(basePath) : router.push(key)
        }
        items={[
          {
            label: "Combined Board",
            icon: <Icons.ProjectOutlined />,
            key: overviewKey,
          },
          // canUpdateOrganization
          //   ? {
          //       label: "Settings",
          //       icon: <Icons.SettingOutlined />,
          //       key: [basePath, "settings"].join("/"),
          //     }
          //   : null,
          {
            key: "projects",
            icon: <Icons.AppstoreOutlined />,
            label: (
              <Row align="middle" justify="space-between">
                Projects
                {!!canCreateProject && (
                  <div onClick={stopPropagation}>
                    <CreateProjectButton
                      organizationId={workspace.organizationId}
                      type="text"
                      size="small"
                      className="text-secondary"
                      icon={<Icons.PlusOutlined />}
                      workspaceId={workspace.id}
                    />
                  </div>
                )}
              </Row>
            ),
            children: workspace?.projects.map((project) => ({
              icon: isProjectPrivate(project) ? (
                <Icons.LockOutlined />
              ) : undefined,
              label: project.name,
              key: new URL(project.permalink).pathname,
            })),
          },
        ]}
      />
    </>
  );
};
