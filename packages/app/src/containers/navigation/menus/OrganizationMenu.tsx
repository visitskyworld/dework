import React, { FC } from "react";
import { Menu, Row, Tag, Typography } from "antd";
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
import { MenuSkeleton } from "./MenuSkeleton";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { CreateFundingSessionButton } from "../../funding/create/CreateFundingSessionButton";
import moment from "moment";

interface Props {
  organizationId: string;
}

export const OrganizationMenu: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganizationDetails(organizationId);
  const workspaces = useOrganizationWorkspaces(organizationId);
  const isProjectPrivate = useIsProjectPrivateFn(organizationId);
  const canUpdateOrganization = usePermission("update", "Organization");
  const canCreateFundingSession = usePermission("create", "FundingSession");

  const router = useRouter();

  const canCreateProject = usePermission("create", {
    __typename: "Project",
    organizationId: organizationId!,
  });

  if (!organization) return <MenuSkeleton />;
  const showFunding =
    !!organization?.fundingSessions.length || canCreateFundingSession;
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
        mode="inline"
        className={styles.menu}
        selectedKeys={[
          router.asPath === basePath ? overviewKey : router.asPath,
        ]}
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
            icon: <Icons.ProjectOutlined />,
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
                  <Typography.Text
                    type="secondary"
                    className="hover:cursor-pointer"
                    onClick={() => router.push(workspace.permalink)}
                  >
                    {workspace.name}
                  </Typography.Text>
                  {!!canCreateProject && (
                    <div onClick={stopPropagation}>
                      <CreateProjectButton
                        organizationId={organization.id}
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
              children: workspace.projects.map((project) => ({
                icon: isProjectPrivate(project) ? (
                  <Icons.LockOutlined />
                ) : undefined,
                label: project.name,
                key: new URL(project.permalink).pathname,
              })),
            })
          ),
          showFunding ? { type: "divider" } : null,
          showFunding
            ? {
                label: (
                  <Row align="middle" justify="space-between">
                    Rewarding
                    {canCreateFundingSession && (
                      <CreateFundingSessionButton
                        type="text"
                        size="small"
                        className="text-secondary"
                        icon={<Icons.PlusOutlined />}
                        organizationId={organization?.id}
                      />
                    )}
                  </Row>
                ),
                type: "group",
                children: (organization.fundingSessions ?? []).map(
                  (session) => ({
                    label: (
                      <Row align="middle" justify="space-between">
                        {[session.startDate, session.endDate]
                          .map((d) => moment(d).format("MMM D"))
                          .join(" - ")}
                        {!!session.closedAt ? (
                          <Tag color="blue">Closed</Tag>
                        ) : (
                          <Tag color="green">Open</Tag>
                        )}
                      </Row>
                    ),
                    key: session.permalink,
                  })
                ),
              }
            : null,
        ]}
      />
    </>
  );
};
