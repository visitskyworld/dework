import React, { FC } from "react";
import { Breadcrumb, PageHeader, Avatar, Button, Typography, Row } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "../contexts/AuthContext";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const { user } = useAuthContext();
  return (
    <PageHeader
      title="dewo"
      // subTitle="the DAO task manager"
      avatar={{
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/183px-BTC_Logo.svg.png",
      }}
      extra={[
        !user && (
          <Button key="sign-in" href="/auth">
            Sign In
          </Button>
        ),
        !!user && (
          <Row key="user" align="middle">
            <Avatar
              key="profile"
              src={user.imageUrl}
              icon={<Icons.UserOutlined />}
            />
            <Typography.Text key="user.name" type="secondary">
              {user.username}
            </Typography.Text>
          </Row>
        ),
      ]}
    >
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#citydao">CityDAO</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#development">Development</a>
        </Breadcrumb.Item>
      </Breadcrumb>
    </PageHeader>
  );
};
