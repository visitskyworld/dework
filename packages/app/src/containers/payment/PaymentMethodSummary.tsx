import { PaymentMethod } from "@dewo/app/graphql/types";
import { Alert, Typography } from "antd";
import React, { FC } from "react";
import { shortenedAddress } from "./hooks";
import { paymentMethodTypeToString } from "./PaymentMethodForm";

interface PaymentMethodSummaryProps {
  paymentMethod: PaymentMethod;
  onClose?(): void;
}

export const PaymentMethodSummary: FC<PaymentMethodSummaryProps> = ({
  paymentMethod,
  onClose,
}) => {
  return (
    <Alert
      message={
        <Typography.Text>
          {paymentMethodTypeToString[paymentMethod.type]} connected
          <Typography.Text type="secondary">
            {" "}
            ({shortenedAddress(paymentMethod.address)})
          </Typography.Text>
        </Typography.Text>
      }
      type="success"
      showIcon
      closable={!!onClose}
      onClose={onClose}
    />
  );
};
