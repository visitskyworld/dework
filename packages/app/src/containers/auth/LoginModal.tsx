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
} from "@dewo/app/containers/auth/hooks";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { Constants } from "@dewo/app/util/constants";
import { MetamaskAuthButton } from "./MetamaskAuthButton";
import { PhantomAuthButton } from "./PhantomAuthButton";

interface Props {
  redirectUrl?: string;
  redirectToOnboarding?: boolean;
  toggle: UseToggleHook;
  onAuthedWithWallet?(user: UserDetails, threepidId: string): void;
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
  const handleAuthedWithWallet = useCallback(
    async (user: UserDetails, threepidId: string) => {
      onAuthedWithWallet?.(user, threepidId);

      if (!user.onboarding && redirectToOnboarding) {
        await router.push("/onboarding");
      }
    },
    [onAuthedWithWallet, redirectToOnboarding, router]
  );

  const authingWithHiro = useToggle();
  const createHiroThreepid = useCreateHiroThreepid();
  const authWithHiro = useCallback(async () => {
    try {
      authingWithHiro.toggleOn();
      const threepidId = await createHiroThreepid();
      const user = await authWithThreepid(threepidId);
      await handleAuthedWithWallet(user, threepidId);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      authingWithHiro.toggleOff();
    }
  }, [
    handleAuthedWithWallet,
    createHiroThreepid,
    authWithThreepid,
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
        <MetamaskAuthButton
          children={getThreepidName[ThreepidSource.metamask]}
          size="large"
          type="ghost"
          block
          state={state}
          onAuthed={handleAuthedWithWallet}
        />
        <PhantomAuthButton
          children={getThreepidName[ThreepidSource.phantom]}
          size="large"
          type="ghost"
          block
          state={state}
          onAuthed={handleAuthedWithWallet}
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
