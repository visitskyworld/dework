import React, { FC, useCallback, useMemo } from "react";
import { Modal, Popconfirm, Space } from "antd";
import { useRouter } from "next/router";
import MobileDetect from "mobile-detect";
import { ThreepidSource } from "@dewo/app/graphql/types";
import {
  getThreepidName,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/ThreepidAuthButton";
import { useCreateMetamaskThreepid } from "@dewo/app/containers/auth/hooks";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";
import { useProvider } from "@dewo/app/util/ethereum";

interface Props {
  toggle: UseToggleHook;
}

export const LoginModal: FC<Props> = ({ toggle }) => {
  const router = useRouter();
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const state = useMemo(
    () => ({ ...router.query, redirect: router.asPath, appUrl }),
    [router.query, router.asPath, appUrl]
  );

  const isMetamaskAvailable = !!useProvider().current;
  const authingWithMetamask = useToggle();
  const createMetamaskThreepid = useCreateMetamaskThreepid();
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    const md = new MobileDetect(window.navigator.userAgent);
    return md.is("iOS") || md.is("AndroidOS");
  }, []);

  const authWithMetamask = useCallback(async () => {
    if (!isMetamaskAvailable) {
      window.open(
        `https://metamask.app.link/dapp/${window.location.hostname}/${window.location.pathname}`
      );
      return;
    }

    try {
      authingWithMetamask.toggleOn();
      const threepidId = await createMetamaskThreepid();
      await router.push(
        `/auth/3pid/${threepidId}?state=${JSON.stringify(state)}`
      );
    } catch (error) {
      alert((error as Error).message);
    } finally {
      authingWithMetamask.toggleOff();
    }
  }, [
    createMetamaskThreepid,
    router,
    state,
    authingWithMetamask,
    isMetamaskAvailable,
  ]);

  const showMetamaskPrompt = isMobile && !isMetamaskAvailable;
  return (
    <Modal
      visible={toggle.isOn}
      footer={null}
      title="Connect"
      width={368}
      onCancel={toggle.toggleOff}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Popconfirm
          title="To connect with Metamask on mobile, open the Metamask app, go to the browser tab, and open dework.xyz"
          disabled={!showMetamaskPrompt}
          okText="Open Metamask"
          onConfirm={authWithMetamask}
          style={{ maxWidth: 120 }}
        >
          <ThreepidAuthButton
            loading={authingWithMetamask.isOn}
            source={ThreepidSource.metamask}
            children={getThreepidName[ThreepidSource.metamask]}
            size="large"
            type="ghost"
            block
            state={state}
            href={undefined}
            onClick={showMetamaskPrompt ? undefined : authWithMetamask}
          />
        </Popconfirm>
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
  );
};
