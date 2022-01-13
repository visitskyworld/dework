import { Button, message, Modal, Space, Typography } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useCurrentUser } from "@dewo/app/util/hooks";
import { ApolloError } from "@apollo/client";
import _ from "lodash";
import { AddPaymentMethodButton } from "../payment/AddPaymentMethodButton";
import { shortenedAddress } from "../payment/hooks";
import { Invite, PaymentToken } from "@dewo/app/graphql/types";
import { useAcceptInvite } from "./hooks";

interface Props {
  invites: Invite[];
  visible: boolean;
  onDone?(): Promise<unknown>;
  onClose(): void;
}

export const JoinTokenGatedProjectsModal: FC<Props> = ({
  invites,
  visible,
  onDone,
  onClose,
}) => {
  const user = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const acceptInvite = useAcceptInvite();
  const acceptInvites = useCallback(
    async (token: PaymentToken) => {
      setLoading(true);

      const tokenInvites = invites.filter((i) =>
        i.project?.tokenGates.some((tg) => tg.token.id === token.id)
      );

      for (const invite of tokenInvites) {
        try {
          const acceptedInvite = await acceptInvite(invite.id);
          message.success(
            `Joined ${acceptedInvite.project?.name} using ${token.symbol}`
          );
        } catch (error) {
          if (error instanceof ApolloError) {
            const reason =
              error.graphQLErrors[0]?.extensions?.exception?.response?.reason;
            if (reason === "MISSING_TOKENS") {
              message.error(`You don't have ${token.symbol} in any wallet`);
            }
          }
        }
      }

      await onDone?.();
      onClose();
      setLoading(false);
    },
    [acceptInvite, onDone, onClose, invites]
  );

  const tokens = useMemo(
    () =>
      _(invites)
        .map((i) => i.project?.tokenGates ?? [])
        .flatten()
        .map((tg) => tg.token)
        .uniqBy((t) => t.id)
        .value(),
    [invites]
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
              {!!pms.length && (
                <Typography.Text style={{ whiteSpace: "pre" }}>
                  Connected wallets on {token.network.name}:{"\n"}
                  {pms.map((pm) => shortenedAddress(pm.address)).join("\n")}
                </Typography.Text>
              )}
              {!!pms.length && (
                <Button
                  block
                  type="primary"
                  loading={loading}
                  onClick={() => acceptInvites(token)}
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
