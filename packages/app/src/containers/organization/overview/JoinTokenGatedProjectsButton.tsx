import { Button, message, Modal, Space, Typography } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useOrganization } from "../hooks";
import * as Icons from "@ant-design/icons";
import { useCurrentUser, useToggle } from "@dewo/app/util/hooks";
import { useAcceptInvite } from "../../invite/hooks";
import { ApolloError } from "@apollo/client";
import _ from "lodash";
import { LoginButton } from "../../auth/LoginButton";
import { AddPaymentMethodButton } from "../../payment/AddPaymentMethodButton";
import { shortenedAddress } from "../../payment/hooks";

interface Props {
  organizationId: string;
}

export const JoinTokenGatedProjectsButton: FC<Props> = ({ organizationId }) => {
  const modalVisible = useToggle();
  const user = useCurrentUser();

  const { organization, refetch } = useOrganization(organizationId);

  const invites = useMemo(
    () =>
      organization?.tokenGatedInvites
        .filter((invite) => !!invite.project)
        .filter(
          (i) => !organization.projects.some((p) => p.id === i.project!.id)
        ),
    [organization]
  );

  const [loading, setLoading] = useState(false);
  const acceptInvite = useAcceptInvite();
  const acceptAllInvites = useCallback(async () => {
    if (!invites) return;

    setLoading(true);

    for (const invite of invites) {
      const token = invite.token!;
      try {
        const acceptedInvite = await acceptInvite(invite.id);
        message.success(
          `Joined ${acceptedInvite.project?.name} using ${token.symbol}`
        );
      } catch (error) {
        if (error instanceof ApolloError) {
          const reason =
            error.graphQLErrors[0]?.extensions?.exception?.response?.reason;
          if (reason === "MISSING_TOKEN") {
            message.error(
              `Missing ${token.symbol}, so skipped joining project`
            );
          }
        }
      }
    }

    await refetch();
    setLoading(false);
  }, [acceptInvite, refetch, invites]);

  const tokens = useMemo(
    () =>
      _(invites)
        .map((i) => i.token!)
        .uniqBy((t) => t.id)
        .value(),
    [invites]
  );
  const invitesByTokenId = useMemo(
    () => _.groupBy(invites, (i) => i.token!.id),
    [invites]
  );

  if (!invites?.length) return null;
  const buttonText = `Join private projects using ${tokens
    .map((t) => t.symbol)
    .join(", ")}`;
  return (
    <>
      {!!user ? (
        <Button
          type="primary"
          icon={<Icons.LockOutlined />}
          onClick={modalVisible.toggleOn}
        >
          {buttonText}
        </Button>
      ) : (
        <LoginButton type="primary" icon={<Icons.LockOutlined />}>
          {buttonText}
        </LoginButton>
      )}
      {!!user && (
        <Modal
          visible={modalVisible.isOn}
          footer={null}
          title="Join Private Projects"
          width={368}
          onCancel={modalVisible.toggleOff}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {tokens.map((token) => {
              const invites = invitesByTokenId[token.id];
              const pms = user.paymentMethods.filter((pm) =>
                pm.networks.some((n) => n.id === token.networkId)
              );
              return (
                <>
                  <Typography.Text>
                    {invites.length === 1
                      ? "1 project"
                      : `${invites.length} projects`}{" "}
                    can be joined with {token.symbol} in your wallet on{" "}
                    {token.network.name}. Verify that you have the token or
                    connect a wallet that has it.
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
                      onClick={acceptAllInvites}
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
                </>
              );
            })}
            {/* <Typography.Text>
            Make sure you have {tokens.map((t) => t.symbol).join(", ")} in any
            of the connected wallets below, or connect another one.
          </Typography.Text>
          {user?.paymentMethods.map((paymentMethod) => (
            <PaymentMethodSummary
              type={paymentMethod.type}
              address={paymentMethod.address}
              networkNames={paymentMethod.networks
                .map((n) => n.name)
                .join(", ")}
            />
          ))}
          <Row gutter={8}>
            {!!user?.paymentMethods.length && (
              <Col span={12}>
                <Button
                  block
                  type="primary"
                  loading={loading}
                  onClick={acceptAllInvites}
                >
                  Verify Tokens
                </Button>
              </Col>
            )}
            <Col span={!!user?.paymentMethods.length ? 12 : 24}>
              <AddPaymentMethodButton
                block
                inputOverride={paymentMethodOverride}
                children="Connect Wallet"
              />
            </Col>
          </Row> */}
          </Space>
        </Modal>
      )}
    </>
  );
};
