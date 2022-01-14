import { ThreepidSource } from "@dewo/app/graphql/types";
import { useCurrentUser } from "@dewo/app/util/hooks";
import { Alert, Col, Space, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import {
  getThreepidName,
  renderThreepidIcon,
  ThreepidAuthButton,
} from "../auth/ThreepidAuthButton";
import { AddPaymentMethodButton } from "../payment/AddPaymentMethodButton";
import { useUpdatePaymentMethod } from "../payment/hooks";
import { PaymentMethodSummary } from "../payment/PaymentMethodSummary";

interface Props {}

export const UserSettings: FC<Props> = () => {
  const user = useCurrentUser();
  const paymentMethodOverride = useMemo(() => ({ userId: user?.id }), [user]);

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
              type={paymentMethod.type}
              address={paymentMethod.address}
              networkNames={paymentMethod.networks
                .map((n) => n.name)
                .join(", ")}
              onClose={() => removePaymentMethod(paymentMethod)}
            />
          ))}

          {!!user && (
            <AddPaymentMethodButton
              inputOverride={paymentMethodOverride}
              children="Add Another Address for Receiving Payments"
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
