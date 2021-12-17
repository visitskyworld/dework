import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { Button, Layout, Modal, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useAuthWithThreepid } from "@dewo/app/containers/auth/hooks";
import { useAcceptInvite } from "@dewo/app/containers/invite/hooks";

const Auth: NextPage = () => {
  const router = useRouter();
  const threepidId = router.query.threepidId as string;
  const stateString = router.query.state as string;
  const state = useMemo(
    () => (!!stateString ? JSON.parse(stateString) : {}),
    [stateString]
  );

  const [loading, setLoading] = useState(false);
  const authWithThreepid = useAuthWithThreepid();
  const acceptInvite = useAcceptInvite();

  const auth = useCallback(async () => {
    try {
      setLoading(true);
      await authWithThreepid(threepidId);
      if (!!state.inviteId) {
        await acceptInvite(state.inviteId);
      }
      await router.push(state.redirect ?? "/");
    } finally {
      setLoading(false);
    }
  }, [authWithThreepid, threepidId, router, state, acceptInvite]);
  useEffect(() => {
    auth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Layout.Content>
        <Modal visible footer={null}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Title level={2} style={{ textAlign: "center" }}>
              Connect account
            </Typography.Title>
            <Button size="large" type="primary" block loading={loading}>
              Signing in...
            </Button>
          </Space>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Auth;
