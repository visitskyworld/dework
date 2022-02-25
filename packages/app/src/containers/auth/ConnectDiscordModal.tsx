import React, { FC, useMemo } from "react";
import { useRouter } from "next/router";
import { Modal, Typography } from "antd";

import { ThreepidSource } from "@dewo/app/graphql/types";
import { ThreepidAuthButton } from "@dewo/app/containers/auth/ThreepidAuthButton";

interface Props {
  visible: boolean;
  onClose(): void;
}

export const ConnectDiscordModal: FC<Props> = ({ visible, onClose }) => {
  const router = useRouter();

  const state = useMemo(
    () => ({
      redirect: router.asPath,
    }),
    [router?.asPath]
  );

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{ maxWidth: 340 }}
    >
      <Typography.Paragraph
        type="secondary"
        style={{ textAlign: "center", padding: 16 }}
      >
        To accept this invite, connect to Discord so that the team knows who you
        are!
      </Typography.Paragraph>
      <ThreepidAuthButton
        type="primary"
        key="connect-discord"
        source={ThreepidSource.discord}
        children="Connect with Discord"
        style={{ width: "100%" }}
        state={state}
      />
    </Modal>
  );
};