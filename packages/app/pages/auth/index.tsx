import React, { useCallback, useMemo } from "react";
import { NextPage } from "next";
import { Layout, Modal, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { ThreepidSource } from "@dewo/app/graphql/types";
import {
  getThreepidName,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/ThreepidAuthButton";
import { useCreateMetamaskThreepid } from "@dewo/app/containers/auth/hooks";
import { useToggle } from "@dewo/app/util/hooks";

const Auth: NextPage = () => {
  const router = useRouter();
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const state = useMemo(
    () => ({ ...router.query, appUrl }),
    [router.query, appUrl]
  );

  const authingWithMetamask = useToggle();
  const createMetamaskThreepid = useCreateMetamaskThreepid();
  const authWithMetamask = useCallback(async () => {
    try {
      authingWithMetamask.toggleOn();
      const threepidId = await createMetamaskThreepid();
      await router.push(
        `/auth/3pid/${threepidId}?state=${JSON.stringify(state)}`
      );
    } finally {
      authingWithMetamask.toggleOff();
    }
  }, [createMetamaskThreepid, router, state, authingWithMetamask]);

  return (
    <Layout>
      <Layout.Content>
        <Modal visible footer={null}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Title level={2} style={{ textAlign: "center" }}>
              Sign in
            </Typography.Title>
            <ThreepidAuthButton
              loading={authingWithMetamask.isOn}
              source={ThreepidSource.metamask}
              children={getThreepidName[ThreepidSource.metamask]}
              size="large"
              type="ghost"
              block
              state={state}
              href={undefined}
              onClick={authWithMetamask}
            />
            <ThreepidAuthButton
              source={ThreepidSource.discord}
              children={getThreepidName[ThreepidSource.discord]}
              size="large"
              type="ghost"
              block
              state={state}
            />
            <ThreepidAuthButton
              source={ThreepidSource.github}
              children={getThreepidName[ThreepidSource.github]}
              size="large"
              type="ghost"
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
