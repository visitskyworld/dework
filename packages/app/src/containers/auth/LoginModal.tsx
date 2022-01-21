import React, { FC, useCallback, useMemo } from "react";
import { Modal, Space } from "antd";
import { useRouter } from "next/router";
import { ThreepidSource } from "@dewo/app/graphql/types";
import {
  getThreepidName,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/ThreepidAuthButton";
import {
  useAuthWithThreepid,
  useCreateHiroThreepid,
  useCreateMetamaskThreepid,
} from "@dewo/app/containers/auth/hooks";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";
import { stopPropagation } from "@dewo/app/util/eatClick";

interface Props {
  toggle: UseToggleHook;
  onAuthedWithWallet?(): void;
}

export const LoginModal: FC<Props> = ({ toggle, onAuthedWithWallet }) => {
  const router = useRouter();
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const state = useMemo(
    () => ({ ...router.query, redirect: router.asPath, appUrl }),
    [router.query, router.asPath, appUrl]
  );

  const authWithThreepid = useAuthWithThreepid();

  const authingWithMetamask = useToggle();
  const createMetamaskThreepid = useCreateMetamaskThreepid();
  const authWithMetamask = useCallback(async () => {
    try {
      authingWithMetamask.toggleOn();
      const threepidId = await createMetamaskThreepid();
      await authWithThreepid(threepidId);
      onAuthedWithWallet?.();
    } catch (error) {
      alert((error as Error).message);
      throw error;
    } finally {
      authingWithMetamask.toggleOff();
    }
  }, [
    createMetamaskThreepid,
    authWithThreepid,
    onAuthedWithWallet,
    authingWithMetamask,
  ]);

  const authingWithHiro = useToggle();
  const createHiroThreepid = useCreateHiroThreepid();
  const authWithHiro = useCallback(async () => {
    try {
      authingWithHiro.toggleOn();
      const threepidId = await createHiroThreepid();
      await authWithThreepid(threepidId);
      onAuthedWithWallet?.();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      authingWithHiro.toggleOff();
    }
  }, [
    createHiroThreepid,
    authWithThreepid,
    onAuthedWithWallet,
    authingWithHiro,
  ]);

  const handleCancel = useCallback(
    (e) => {
      toggle.toggleOff();
      stopPropagation(e);
    },
    [toggle]
  );

  return (
    <Modal
      visible={toggle.isOn}
      footer={null}
      title="Connect"
      width={368}
      onCancel={handleCancel}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <ThreepidAuthButton
          source={ThreepidSource.discord}
          children={`${getThreepidName[ThreepidSource.discord]} (recommended)`}
          size="large"
          type="ghost"
          block
          state={state}
        />
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
          loading={authingWithHiro.isOn}
          source={ThreepidSource.hiro}
          children={getThreepidName[ThreepidSource.hiro]}
          size="large"
          type="ghost"
          block
          state={state}
          href={undefined}
          onClick={authWithHiro}
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
