import React, { useMemo } from "react";
import { NextPage } from "next";
import { Layout, Modal, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { ThreepidSource } from "@dewo/app/graphql/types";
import {
  getThreepidName,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/ThreepidAuthButton";

const Auth: NextPage = () => {
  const router = useRouter();
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const state = useMemo(
    () => ({ ...router.query, appUrl }),
    [router.query, appUrl]
  );
  return (
    <Layout>
      <Layout.Content>
        <Modal visible footer={null}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Title level={2} style={{ textAlign: "center" }}>
              Sign in
            </Typography.Title>
            <ThreepidAuthButton
              source={ThreepidSource.metamask}
              children={getThreepidName[ThreepidSource.metamask]}
              size="large"
              type="primary"
              block
              state={state}
            />
            <ThreepidAuthButton
              source={ThreepidSource.discord}
              children={getThreepidName[ThreepidSource.discord]}
              size="large"
              type="primary"
              block
              state={state}
            />
            <ThreepidAuthButton
              source={ThreepidSource.github}
              children={getThreepidName[ThreepidSource.github]}
              size="large"
              type="primary"
              block
              state={state}
            />
          </Space>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Auth;
