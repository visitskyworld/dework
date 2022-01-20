import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { ThreepidSource } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Alert, Col, Space, Typography } from "antd";
import React, { FC, useCallback } from "react";
import { useAuthWithThreepid, useCreateMetamaskThreepid } from "../auth/hooks";
import {
  getThreepidName,
  renderThreepidIcon,
  ThreepidAuthButton,
} from "../auth/ThreepidAuthButton";
import { useUpdatePaymentMethod } from "../payment/hooks";
import { PaymentMethodSummary } from "../payment/PaymentMethodSummary";
import { AddUserPaymentMethodButton } from "../payment/user/AddUserPaymentMethodButton";

interface Props {}

export const UserSettings: FC<Props> = () => {
  const { user } = useAuthContext();

  const updatePaymentMethod = useUpdatePaymentMethod();
  const removePaymentMethod = useCallback(
    (pm) =>
      updatePaymentMethod({ id: pm.id, deletedAt: new Date().toISOString() }),
    [updatePaymentMethod]
  );

  const authingWithMetamask = useToggle();
  const createMetamaskThreepid = useCreateMetamaskThreepid();
  const authWithThreepid = useAuthWithThreepid();
  const authWithMetamask = useCallback(async () => {
    try {
      authingWithMetamask.toggleOn();
      const threepidId = await createMetamaskThreepid();
      await authWithThreepid(threepidId);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      authingWithMetamask.toggleOff();
    }
  }, [createMetamaskThreepid, authWithThreepid, authingWithMetamask]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Col>
        <Typography.Title level={5}>
          Address to Receive Payments
        </Typography.Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          {user?.paymentMethods.map((paymentMethod) => (
            <PaymentMethodSummary
              type={paymentMethod.type}
              address={paymentMethod.address}
              networkNames={paymentMethod.networks
                .map((n) => n.name)
                .join(", ")}
              onClose={() => removePaymentMethod(paymentMethod)}
            />
          ))}

          {!!user && (
            <AddUserPaymentMethodButton
              userId={user?.id}
              children="Connect Wallet for Receiving Payments"
            />
          )}
        </Space>
      </Col>
      <Col>
        <Typography.Title level={5}>Connected Accounts</Typography.Title>
        <Space direction="vertical">
          {[
            ThreepidSource.github,
            ThreepidSource.discord,
            ThreepidSource.metamask,
          ].map((source) =>
            user?.threepids.some((t) => t.source === source) ? (
              <Alert
                key={source}
                message={`Connected with ${getThreepidName[source]}`}
                icon={renderThreepidIcon[source]}
                type="success"
                showIcon
              />
            ) : (
              <ThreepidAuthButton
                key={source}
                source={source}
                children={`Connect with ${getThreepidName[source]}`}
                {...(source === ThreepidSource.metamask && {
                  onClick: authWithMetamask,
                  href: undefined,
                  loading: authingWithMetamask.isOn,
                })}
              />
            )
          )}
        </Space>
      </Col>
    </Space>
  );
};
