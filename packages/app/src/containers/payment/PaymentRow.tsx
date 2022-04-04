import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Typography } from "antd";
import { Payment } from "@dewo/app/graphql/types";
import { PaymentStatusTag } from "@dewo/app/components/PaymentStatusTag";
import { explorerLink } from "./hooks";

interface Props {
  payment: Payment;
}

export const PaymentRow: FC<Props> = ({ payment }) => {
  return (
    <>
      <PaymentStatusTag status={payment.status} />
      <a target="_blank" href={explorerLink(payment)} rel="noreferrer">
        <Typography.Paragraph
          type="secondary"
          className="ant-typography-caption"
        >
          View on explorer <Icons.ExportOutlined />
        </Typography.Paragraph>
      </a>
    </>
  );
};
