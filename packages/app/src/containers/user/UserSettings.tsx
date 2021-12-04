import { PaymentMethod } from "@dewo/app/graphql/types";
import { useUser } from "@dewo/app/util/hooks";
import { Col, Space, Typography } from "antd";
import React, { FC, useCallback } from "react";
import { PaymentMethodForm } from "../payment/PaymentMethodForm";
import { PaymentMethodSummary } from "../payment/PaymentMethodSummary";

interface Props {}

export const UserSettings: FC<Props> = () => {
  const user = useUser();

  const updateUser = useCallback(async () => {}, []);
  const handlePaymentMethodCreated = useCallback(
    async (paymentMethod: PaymentMethod) => {
      await updateUser({ paymentMethodId: paymentMethod.id });
    },
    [updateUser]
  );
  const removePaymentMethod = useCallback(async () => {
    await updateUser({ paymentMethodId: null });
  }, [updateUser]);
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Col>
        <Typography.Title level={5}>Reward Payment Method</Typography.Title>
        {!!user.paymentMethod ? (
          <PaymentMethodSummary
            paymentMethod={user.paymentMethod}
            onClose={removePaymentMethod}
          />
        ) : (
          <PaymentMethodForm onDone={handlePaymentMethodCreated} />
        )}
      </Col>
    </Space>
  );
};
