import React, { useEffect, useCallback } from "react";
import { NextPage } from "next";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { LoginModal } from "@dewo/app/containers/auth/LoginModal";
import { useToggle } from "@dewo/app/util/hooks";

const Auth: NextPage = () => {
  const modalVisible = useToggle();
  const router = useRouter();

  useEffect(() => {
    modalVisible.toggleOn();
  }, [modalVisible]);

  const handleAuthedWithWallet = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <Layout>
      <Layout.Content>
        <LoginModal
          toggle={modalVisible}
          onAuthedWithWallet={handleAuthedWithWallet}
        />
      </Layout.Content>
    </Layout>
  );
};

export default Auth;
