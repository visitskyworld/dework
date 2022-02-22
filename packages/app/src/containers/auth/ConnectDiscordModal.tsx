import React, { FC, useMemo } from "react";
import { useRouter } from "next/router";
import { Alert, Modal, Typography } from "antd";

import { ThreepidSource } from "@dewo/app/graphql/types";
import {
  renderThreepidIcon,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/ThreepidAuthButton";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

interface Props {
  visible: boolean;
  onClose(): void;
}

export const ConnectDiscordModal: FC<Props> = ({ visible, onClose }) => {
  const { user } = useAuthContext();
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
      {user?.threepids.some((t) => t.source === ThreepidSource.discord) ? (
        <Alert
          key="discord-connected"
          message={`Connected with Discord`}
          icon={renderThreepidIcon[ThreepidSource.discord]}
          type="success"
          showIcon
        />
      ) : (
        <ThreepidAuthButton
          key="connect-discord"
          source={ThreepidSource.discord}
          children="Connect with Discord"
          style={{ width: "100%" }}
          state={state}
        />
      )}
    </Modal>
  );
};
