import { Button, Col, message, Modal, Row, Space, Typography } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useOrganization } from "../hooks";
import * as Icons from "@ant-design/icons";
import { useCurrentUser, useToggle } from "@dewo/app/util/hooks";
import { PaymentMethodSummary } from "../../payment/PaymentMethodSummary";
import { AddPaymentMethodButton } from "../../payment/AddPaymentMethodButton";
import { useAcceptInvite } from "../../invite/hooks";
import { ApolloError } from "@apollo/client";
import _ from "lodash";
import { PaymentToken } from "@dewo/app/graphql/types";

interface Props {
  organizationId: string;
}

export const JoinTokenGatedProjectsButton: FC<Props> = ({ organizationId }) => {
  const modalVisible = useToggle();
  const user = useCurrentUser();
  const paymentMethodOverride = useMemo(() => ({ userId: user?.id }), [user]);

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
        .map((i) => i.token)
        .filter((t): t is PaymentToken => !!t)
        .uniqBy((t) => t.id)
        .value(),
    [invites]
  );

  if (!invites?.length) return null;
  return (
    <>
      <Button
        size="small"
        type="primary"
        icon={<Icons.KeyOutlined />}
        onClick={modalVisible.toggleOn}
      >
        Join private projects using {tokens.map((t) => t.symbol).join(", ")}
      </Button>
      <Modal
        visible={modalVisible.isOn}
        footer={null}
        title="Join Private Projects"
        width={368}
        onCancel={modalVisible.toggleOff}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Text>
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
          </Row>
        </Space>
      </Modal>
    </>
  );
};
