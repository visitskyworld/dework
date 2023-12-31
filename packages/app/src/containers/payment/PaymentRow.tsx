import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Space, Typography } from "antd";
import { Payment, PaymentStatus } from "@dewo/app/graphql/types";
import { PaymentStatusTag } from "@dewo/app/components/PaymentStatusTag";
import { explorerLink } from "./hooks";
import { ClearTaskRewardPaymentButton } from "../task/board/ClearTaskRewardPaymentButton";

interface Props {
  payment: Payment;
}

export const PaymentRow: FC<Props> = ({ payment }) => {
  return (
    <>
      <Space direction="vertical" size={4}>
        <PaymentStatusTag status={payment.status} />
        {payment.status !== PaymentStatus.CONFIRMED && (
          <ClearTaskRewardPaymentButton payment={payment}>
            Clear transaction
          </ClearTaskRewardPaymentButton>
        )}
        <a target="_blank" href={explorerLink(payment)} rel="noreferrer">
          <Typography.Paragraph
            type="secondary"
            className="ant-typography-caption"
          >
            View on explorer <Icons.ExportOutlined />
          </Typography.Paragraph>
        </a>
      </Space>
    </>
  );
};
