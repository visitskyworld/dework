import { PaymentMethodType } from "@dewo/app/graphql/types";
import { Alert, Typography } from "antd";
import React, { FC } from "react";
import { shortenedAddress } from "./hooks";
import { paymentMethodTypeToString } from "./PaymentMethodForm";

interface PaymentMethodSummaryProps {
  type: PaymentMethodType;
  address: string;
  onClose?(): void;
}

export const PaymentMethodSummary: FC<PaymentMethodSummaryProps> = ({
  type,
  address,
  onClose,
}) => {
  return (
    <Alert
      message={
        <Typography.Text>
          {paymentMethodTypeToString[type]} connected
          <Typography.Text type="secondary">
            {" "}
            ({shortenedAddress(address)})
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
