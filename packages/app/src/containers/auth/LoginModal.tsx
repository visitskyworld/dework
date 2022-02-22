import React, { FC, useCallback, useMemo } from "react";
import { Modal, Space } from "antd";
import { useRouter } from "next/router";
import { ThreepidSource, UserDetails } from "@dewo/app/graphql/types";
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
import { Constants } from "@dewo/app/util/constants";

interface Props {
  redirectUrl?: string;
  redirectToOnboarding?: boolean;
  toggle: UseToggleHook;
  onAuthedWithWallet?(user: UserDetails): void;
}

export const LoginModal: FC<Props> = ({
  toggle,
  redirectUrl,
  redirectToOnboarding = false,
  onAuthedWithWallet,
}) => {
  const router = useRouter();
  const appUrl = Constants.APP_URL;
  const state = useMemo(
    () => ({ ...router.query, redirect: redirectUrl ?? router.asPath, appUrl }),
    [router.query, router.asPath, appUrl, redirectUrl]
  );

  const authWithThreepid = useAuthWithThreepid();

  const authingWithMetamask = useToggle();
  const createMetamaskThreepid = useCreateMetamaskThreepid();
  const authWithMetamask = useCallback(async () => {
    try {
      authingWithMetamask.toggleOn();
      const threepidId = await createMetamaskThreepid();
      const user = await authWithThreepid(threepidId);
      onAuthedWithWallet?.(user);

      if (!user.onboarding && redirectToOnboarding) {
        await router.push("/onboarding");
      }
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
    router,
    redirectToOnboarding,
  ]);

  const authingWithHiro = useToggle();
  const createHiroThreepid = useCreateHiroThreepid();
  const authWithHiro = useCallback(async () => {
    try {
      authingWithHiro.toggleOn();
      const threepidId = await createHiroThreepid();
      const user = await authWithThreepid(threepidId);
      onAuthedWithWallet?.(user);

      if (!user.onboarding && redirectToOnboarding) {
        await router.push("/onboarding");
      }
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
    router,
    redirectToOnboarding,
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
