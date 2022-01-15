import { Button, Modal, Space, Typography } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useCurrentUser } from "@dewo/app/util/hooks";
import { AddPaymentMethodButton } from "../payment/AddPaymentMethodButton";
import { ProjectTokenGate } from "@dewo/app/graphql/types";
import { PaymentMethodSummary } from "../payment/PaymentMethodSummary";

interface Props {
  tokens: ProjectTokenGate["token"][];
  visible: boolean;
  onVerify(token: ProjectTokenGate["token"]): Promise<void>;
  onClose(): void;
}

export const JoinTokenGatedProjectsModal: FC<Props> = ({
  tokens,
  visible,
  onVerify,
  onClose,
}) => {
  const user = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const verifyToken = useCallback(
    async (token: ProjectTokenGate["token"]) => {
      setLoading(true);
      try {
        await onVerify(token);
      } finally {
        setLoading(false);
      }
    },
    [onVerify]
  );

  if (!user) return null;
  return (
    <Modal
      visible={visible}
      footer={null}
      title="Token Gate"
      width={368}
      onCancel={onClose}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {tokens.map((token) => {
          const pms = user.paymentMethods.filter((pm) =>
            pm.networks.some((n) => n.id === token.networkId)
          );
          return (
            <Space key={token.id} direction="vertical">
              <Typography.Text>
                You need {token.symbol} on {token.network.name} in your wallet
                to join. Verify that you have the token or connect a wallet that
                has it.
              </Typography.Text>
              {pms.map((pm) => (
                <PaymentMethodSummary
                  key={pm.id}
                  type={pm.type}
                  networkNames={pm.networks.map((n) => n.name).join(", ")}
                  address={pm.address}
                />
              ))}

              {!!pms.length && (
                <Button
                  block
                  type="primary"
                  loading={loading}
                  onClick={() => verifyToken(token)}
                >
                  Verify Tokens
                </Button>
              )}
              <AddPaymentMethodButton
                block
                inputOverride={{ userId: user.id }}
                children={
                  !!pms.length ? "Connect Other Wallet" : "Connect Wallet"
                }
              />
            </Space>
          );
        })}
      </Space>
    </Modal>
  );
};
