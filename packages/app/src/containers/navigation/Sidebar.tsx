import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Col, Divider, Dropdown, Layout, Row } from "antd";
import Link from "next/link";
import React, { FC } from "react";
import { HeaderProfileDropdown } from "./header/HeaderProfileMenu";
import { CreateOrganizationButton } from "./CreateOrganizationButton";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  if (!user) return null;
  return (
    <Layout.Sider width={72}>
      <Col style={{ height: "100%", alignItems: "center", paddingBottom: 12 }}>
        <Link href="/">
          <a className="dewo-sidebar-item">
            <Avatar size={48} icon={"/"} />
          </a>
        </Link>
        <Row className="dewo-sidebar-item">
          <Dropdown
            key="avatar"
            placement="bottomLeft"
            overlay={<HeaderProfileDropdown />}
          >
            <UserAvatar user={user} size={48} tooltip={{ title: undefined }} />
          </Dropdown>
        </Row>

        <Divider />
        {user?.organizations.map((organization) => (
          <Link key={organization.id} href={`/organization/${organization.id}`}>
            <a className="dewo-sidebar-item">
              <OrganizationAvatar
                size={48}
                organization={organization}
                tooltip={{ placement: "right" }}
              />
            </a>
          </Link>
        ))}
        <CreateOrganizationButton />
      </Col>
    </Layout.Sider>
  );
};
