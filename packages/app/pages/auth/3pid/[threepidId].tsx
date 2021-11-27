import React, { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { Button, Layout, Modal, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useAuthWithThreepid } from "@dewo/app/containers/auth/hooks";

const Auth: NextPage = () => {
  const router = useRouter();
  const threepidId = router.query.threepidId as string;
  const [loading, setLoading] = useState(false);
  const authWithThreepid = useAuthWithThreepid();

  const auth = useCallback(async () => {
    try {
      setLoading(true);
      await authWithThreepid(threepidId);
      await router.push("/");
    } finally {
      setLoading(false);
    }
  }, [authWithThreepid, threepidId, router]);
  useEffect(() => {
    auth();
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
