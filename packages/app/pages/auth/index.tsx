import React from "react";
import { NextPage } from "next";
import { Button, Layout, Modal, Space, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { MetamaskIcon } from "@dewo/app/components/icons/Metamask";
import { Constants } from "@dewo/app/util/constants";

const Auth: NextPage = () => {
  return (
    <Layout>
      <Layout.Content>
        <Modal visible footer={[]}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Title level={2} style={{ textAlign: "center" }}>
              Sign up
            </Typography.Title>
            <Button
              size="large"
              type="primary"
              block
              icon={<Icons.GithubOutlined />}
              href={`${Constants.API_URL}/auth/github`}
            >
              Github
            </Button>
            <Button
              size="large"
              type="primary"
              block
              icon={<DiscordIcon />}
              href={`${Constants.API_URL}/auth/discord`}
            >
              Discord
            </Button>
            <Button size="large" type="primary" block icon={<MetamaskIcon />}>
              Metamask
            </Button>
          </Space>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Auth;
