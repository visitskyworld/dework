import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Avatar, Button, Col, Divider, Dropdown, Layout, Row } from "antd";
import React, { FC } from "react";
import { HeaderProfileDropdown } from "./header/HeaderProfileMenu";

export const OrganizationListSidebar: FC = () => {
  const { user } = useAuthContext();
  if (!user) return null;
  return (
    <Layout.Sider width={72}>
      <Col style={{ height: "100%", alignItems: "center", paddingBottom: 12 }}>
        <Button
          type="text"
          href="/"
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
          <Button
            key={organization.id}
            type="text"
            href={`/organization/${organization.id}`}
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
        ))}

        {/* <div style={{ flex: 1 }} /> */}
        {/* {!!user && (
          <Dropdown
            key="avatar"
            placement="topLeft"
            overlay={<HeaderProfileDropdown />}
          >
            <UserAvatar user={user} size={48} tooltip={{ title: undefined }} />
          </Dropdown>
        )} */}
      </Col>
    </Layout.Sider>
  );
};
