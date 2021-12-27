import { useCurrentUser } from "@dewo/app/util/hooks";
import { Col, Space, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
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
        <Typography.Title level={5}>Reward Payment Method</Typography.Title>
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
              children="Add Payment Method"
            />
          )}
        </Space>
      </Col>
    </Space>
  );
};
