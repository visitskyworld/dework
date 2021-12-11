import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Button, Col, Divider, Dropdown, Layout, Row } from "antd";
import Link from "next/link";
import React, { FC } from "react";
import { HeaderProfileDropdown } from "./header/HeaderProfileMenu";

export const Sidebar: FC = () => {
  const { user } = useAuthContext();
  if (!user) return null;
  return (
    <Layout.Sider width={72}>
      <Col style={{ height: "100%", alignItems: "center", paddingBottom: 12 }}>
        <Link href="/">
          <Button
            type="text"
            style={{
              padding: 0,
              width: 72,
              height: 72,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Avatar size={48} icon={"/"} />
          </Button>
        </Link>
        <Row style={{ display: "grid", placeItems: "center" }}>
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
          <Link href={`/organization/${organization.id}`}>
            <Button
              key={organization.id}
              type="text"
              style={{
                padding: 0,
                width: 72,
                height: 72,
                display: "grid",
                placeItems: "center",
              }}
            >
              <OrganizationAvatar
                size={48}
                organization={organization}
                tooltip={{ placement: "right" }}
              />
            </Button>
          </Link>
        ))}
      </Col>
    </Layout.Sider>
  );
};
