import React from "react";
import _ from "lodash";
import { NextPage } from "next";
import { Button, Layout, Modal, Space, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { Constants } from "@dewo/app/util/constants";
import { useRouter } from "next/router";

const Auth: NextPage = () => {
  const router = useRouter();
  const state = _.isEmpty(router.query) ? "" : JSON.stringify(router.query);
  return (
    <Layout>
      <Layout.Content>
        <Modal visible footer={null}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Title level={2} style={{ textAlign: "center" }}>
              Sign up
            </Typography.Title>
            <Button
              size="large"
              type="primary"
              block
              icon={<Icons.GithubOutlined />}
              href={`${Constants.GRAPHQL_API_URL}/auth/github?state=${state}`}
            >
              Github
            </Button>
            <Button
              size="large"
              type="primary"
              block
              icon={<DiscordIcon />}
              href={`${Constants.GRAPHQL_API_URL}/auth/discord?state=${state}`}
            >
              Discord
            </Button>
          </Space>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Auth;
