import React, { FC, useCallback, useMemo } from "react";
import { Modal, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { ThreepidSource, UserDetails } from "@dewo/app/graphql/types";
import {
  getThreepidName,
  ThreepidAuthButton,
} from "./buttons/ThreepidAuthButton";
import { UseToggleHook } from "@dewo/app/util/hooks";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { Constants } from "@dewo/app/util/constants";
import { MetamaskAuthButton } from "./buttons/MetamaskAuthButton";
import { PhantomAuthButton } from "./buttons/PhantomAuthButton";
import { HiroAuthButton } from "./buttons/HiroAuthButton";
import { MoreSectionCollapse } from "@dewo/app/components/MoreSectionCollapse";

interface Props {
  redirectUrl?: string;
  toggle: UseToggleHook;
  onAuthedWithWallet?(user: UserDetails, threepidId: string): void;
}

export const LoginModal: FC<Props> = ({
  toggle,
  redirectUrl,
  onAuthedWithWallet,
}) => {
  const router = useRouter();
  const appUrl = Constants.APP_URL;
  const state = useMemo(
    () => ({ ...router.query, redirect: redirectUrl ?? router.asPath, appUrl }),
    [router.query, router.asPath, appUrl, redirectUrl]
  );

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
      bodyStyle={{ paddingTop: 80, paddingBottom: 80 }}
      onCancel={handleCancel}
    >
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Welcome to Dework
      </Typography.Title>
      <Typography.Paragraph
        type="secondary"
        style={{ textAlign: "center", fontSize: "130%" }}
      >
        Sign-in to get started
      </Typography.Paragraph>
      <Space
        direction="vertical"
        className="mx-auto w-full"
        style={{ display: "flex", maxWidth: 368 }}
      >
        <ThreepidAuthButton
          source={ThreepidSource.discord}
          children={`${getThreepidName[ThreepidSource.discord]} (recommended)`}
          size="large"
          block
          state={state}
        />
        <MetamaskAuthButton
          children={getThreepidName[ThreepidSource.metamask]}
          size="large"
          block
          state={state}
          onAuthed={onAuthedWithWallet}
        />

        <MoreSectionCollapse label="More">
          <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
            <PhantomAuthButton
              children={getThreepidName[ThreepidSource.phantom]}
              size="large"
              block
              state={state}
              onAuthed={onAuthedWithWallet}
            />
            <HiroAuthButton
              children={getThreepidName[ThreepidSource.hiro]}
              size="large"
              block
              state={state}
              onAuthed={onAuthedWithWallet}
            />
          </Space>
        </MoreSectionCollapse>
      </Space>
    </Modal>
  );
};
