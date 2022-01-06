import React, { FC, useCallback, useMemo } from "react";
import { Modal, Space } from "antd";
import { useRouter } from "next/router";
import { ThreepidSource } from "@dewo/app/graphql/types";
import {
  getThreepidName,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/ThreepidAuthButton";
import { useCreateMetamaskThreepid } from "@dewo/app/containers/auth/hooks";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";

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

  const authingWithMetamask = useToggle();
  const createMetamaskThreepid = useCreateMetamaskThreepid();
  const authWithMetamask = useCallback(async () => {
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
  }, [createMetamaskThreepid, router, state, authingWithMetamask]);

  return (
    <Modal
      visible={toggle.isOn}
      footer={null}
      title="Connect"
      width={368}
      onCancel={toggle.toggleOff}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
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
  );
};
