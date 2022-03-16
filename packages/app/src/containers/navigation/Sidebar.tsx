import React, { FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Button, Col, Divider, Layout, Tooltip } from "antd";
import { HeaderProfileAvatar } from "./header/HeaderProfileAvatar";
import { CreateOrganizationButton } from "./CreateOrganizationButton";
import { SidebarNavLink } from "./SidebarNavLink";
import { useSidebarContext } from "@dewo/app/contexts/sidebarContext";
import _ from "lodash";
import Link from "next/link";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  const { isOn, setToggle } = useSidebarContext();

  const organizations = useMemo(
    () => _.sortBy(user?.organizations, (o) => o.member?.sortKey).reverse(),
    [user?.organizations]
  );

  const isProfileSetup = !!user?.bio || !!user?.details.length;

  if (!user) return null;
  if (typeof window === "undefined") return null;
  return (
    <Layout.Sider
      collapsible
      breakpoint="sm"
      onBreakpoint={setToggle}
      width={72}
      collapsedWidth="0"
      collapsed={isOn}
      trigger={null}
      className="dewo-divider-right"
    >
      <Col
        style={{
          height: "100%",
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SidebarNavLink
          href={user.permalink}
          className="dewo-sidebar-item"
          clickable={false}
        >
          <HeaderProfileAvatar />
        </SidebarNavLink>

        {!isProfileSetup && (
          <Link href={user.permalink}>
            <a>
              <Button
                size="small"
                type="primary"
                className="ant-typography-caption"
                style={{ paddingLeft: 2, paddingRight: 2, border: "none" }}
              >
                Setup profile
              </Button>
            </a>
          </Link>
        )}

        <Divider style={{ margin: "12px 0" }} />

        <Col style={{ flex: 1, overflowX: "hidden", overflowY: "auto" }}>
          {organizations.map((organization) => (
            <SidebarNavLink
              key={organization.id}
              href={organization.permalink}
              className="dewo-sidebar-item"
            >
              <OrganizationAvatar
                size={48}
                organization={organization}
                tooltip={{ placement: "right" }}
              />
            </SidebarNavLink>
          ))}

          <Tooltip title="Create Organization" placement="right">
            <CreateOrganizationButton type="text" className="dewo-sidebar-item">
              <Avatar size={48} icon={<Icons.PlusOutlined />} />
            </CreateOrganizationButton>
          </Tooltip>
        </Col>
      </Col>
    </Layout.Sider>
  );
};
