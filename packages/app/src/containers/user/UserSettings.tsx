import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { ThreepidSource } from "@dewo/app/graphql/types";
import { Alert, Col, Space, Typography } from "antd";
import React, { FC, useCallback } from "react";
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

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Col>
        <Typography.Title level={5}>
          Address to Receive Payments
        </Typography.Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          {user?.paymentMethods.map((paymentMethod) => (
            <PaymentMethodSummary
              key={paymentMethod.id}
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
          {[ThreepidSource.github, ThreepidSource.discord].map((source) =>
            user?.threepids.some((t) => t.source === source) ? (
              <Alert
                message={`Connected with ${getThreepidName[source]}`}
                icon={renderThreepidIcon[source]}
                type="success"
                showIcon
              />
            ) : (
              <ThreepidAuthButton
                source={source}
                children={`Connect with ${getThreepidName[source]}`}
              />
            )
          )}
        </Space>
      </Col>
    </Space>
  );
};
