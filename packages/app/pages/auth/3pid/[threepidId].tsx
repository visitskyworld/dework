import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { Button, Layout, Modal, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useAuthWithThreepid } from "@dewo/app/containers/auth/hooks";
import { useAcceptInvite } from "@dewo/app/containers/invite/hooks";
import { ApolloError } from "@apollo/client";
import Link from "next/link";

const Auth: NextPage = () => {
  const router = useRouter();
  const threepidId = router.query.threepidId as string;
  const stateString = router.query.state as string;
  const state = useMemo(
    () => (!!stateString ? JSON.parse(stateString) : {}),
    [stateString]
  );

  const authWithThreepid = useAuthWithThreepid();
  const acceptInvite = useAcceptInvite();
  const [accountAlreadyConnected, setAccountAlreadyConnected] = useState(false);

  const auth = useCallback(async () => {
    try {
      await authWithThreepid(threepidId);
      if (!!state.inviteId) {
        await acceptInvite(state.inviteId).catch();
      }
      await router.push(state.redirect ?? "/");
    } catch (error) {
      if (error instanceof ApolloError) {
        if (error.message === "Account already connected") {
          setAccountAlreadyConnected(true);
        }

        throw error;
      }
    }
  }, [authWithThreepid, threepidId, router, state, acceptInvite]);
  useEffect(() => {
    auth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Layout.Content>
        <Modal visible footer={null} closable={false}>
          <Space
            direction="vertical"
            style={{ width: "100%", alignItems: "center" }}
          >
            <Typography.Title level={2} style={{ textAlign: "center" }}>
              Connect account
            </Typography.Title>
            {accountAlreadyConnected ? (
              <>
                <Typography.Paragraph style={{ textAlign: "center" }}>
                  This account is already connected to another Dework user.{" "}
                  <a
                    href="https://discord.com/channels/918603668935311391/920039372882051122"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Write to us on Discord
                  </a>{" "}
                  and we will help you connect to both accounts.
                </Typography.Paragraph>
                <Link href="/">
                  <a>
                    <Button size="large">Go back</Button>
                  </a>
                </Link>
              </>
            ) : (
              <Button size="large" type="primary" block loading>
                Signing in...
              </Button>
            )}
          </Space>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Auth;
