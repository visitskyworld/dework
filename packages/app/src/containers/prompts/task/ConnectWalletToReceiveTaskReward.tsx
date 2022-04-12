import { Row, Typography } from "antd";
import React, { FC } from "react";
import { Emojione } from "react-emoji-render";
import { MetamaskAuthButton } from "../../auth/buttons/MetamaskAuthButton";

interface Props {
  onNext(): Promise<void>;
}

export const ConnectWalletToReceiveTaskReward: FC<Props> = ({ onNext }) => {
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Connect your Wallet
      </Typography.Title>
      <Typography.Text
        type="secondary"
        style={{ textAlign: "center", fontSize: "130%" }}
      >
        You have a task waiting to be paid!
      </Typography.Text>

      <Row align="middle" justify="center" style={{ flex: 1, fontSize: 100 }}>
        <Emojione svg text="💸" className="emojione" />
      </Row>

      <MetamaskAuthButton
        children="Connect Metamask"
        size="large"
        type="primary"
        name="Task Reward: connect Metamask to receive reward"
        style={{ alignSelf: "center" }}
        onAuthed={onNext}
      />
    </>
  );
};
