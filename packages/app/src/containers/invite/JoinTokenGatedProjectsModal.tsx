import { Button, message, Modal, Space, Typography } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import { ProjectTokenGate, ThreepidSource } from "@dewo/app/graphql/types";
import { ApolloError } from "@apollo/client";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { MetamaskAuthButton } from "../auth/MetamaskAuthButton";

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
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const verifyToken = useCallback(
    async (token: ProjectTokenGate["token"]) => {
      setLoading(true);
      try {
        await onVerify(token);
      } catch (error) {
        if (error instanceof ApolloError) {
          const reason =
            error.graphQLErrors[0]?.extensions?.exception?.response?.reason;
          if (reason === "MISSING_TOKENS") {
            message.error(
              `You don't have ${token.symbol} in any connected wallet`
            );
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [onVerify]
  );

  const isConnectedWithMetamask = useMemo(
    () => !!user?.threepids.some((t) => t.source === ThreepidSource.metamask),
    [user]
  );

  if (!user) return null;
  return (
    <Modal
      visible={visible}
      footer={null}
      title="Token Gate"
      width={368}
      maskClosable={false}
      onCancel={onClose}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {tokens.map((token) => {
          return (
            <Space key={token.id} direction="vertical">
              <Typography.Text>
                You need{" "}
                <Typography.Text strong>{token.symbol}</Typography.Text> on{" "}
                {token.network.name} in your wallet to join
              </Typography.Text>

              {isConnectedWithMetamask ? (
                <Button
                  block
                  type="primary"
                  loading={loading}
                  onClick={() => verifyToken(token)}
                >
                  Verify Tokens
                </Button>
              ) : (
                <MetamaskAuthButton block type="primary">
                  Connect with Metamask
                </MetamaskAuthButton>
              )}
            </Space>
          );
        })}
      </Space>
    </Modal>
  );
};
