import React, { FC, useCallback } from "react";
import { Breadcrumb, PageHeader, Avatar, Button, Typography, Row } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "../contexts/AuthContext";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const auth = useAuthContext();
  const handleSignIn = useCallback(async () => {
    auth.onUpdate({
      id: String(Math.random()),
      name: "fant",
      imageUrl:
        "https://pbs.twimg.com/profile_images/790623629771993088/pkGxKJhp_400x400.jpg",
    });
  }, [auth]);
  return (
    <PageHeader
      title="dewo"
      // subTitle="the DAO task manager"
      avatar={{
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/183px-BTC_Logo.svg.png",
      }}
      extra={[
        !auth.user && (
          <Button key="sign-in" onClick={handleSignIn}>
            Sign In
          </Button>
        ),
        !!auth.user && (
          <Row key="user" align="middle">
            <Avatar
              key="profile"
              src={auth.user.imageUrl}
              icon={<Icons.UserOutlined />}
            />
            <Typography.Text key="user.name" type="secondary">
              {auth.user.name}
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
