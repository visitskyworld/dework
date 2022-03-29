import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Row, Typography } from "antd";
import { Payment } from "@dewo/app/graphql/types";
import { PaymentStatusTag } from "@dewo/app/components/PaymentStatusTag";
import { explorerLink } from "./hooks";

interface Props {
  payment: Payment;
}

export const PaymentRow: FC<Props> = ({ payment }) => {
  return (
    <>
      <Row>
        <PaymentStatusTag status={payment.status} />
      </Row>
      <Row>
        <a target="_blank" href={explorerLink(payment)} rel="noreferrer">
          <Typography.Text type="secondary" className="ant-typography-caption">
            View on explorer <Icons.ExportOutlined />
          </Typography.Text>
        </a>
      </Row>
    </>
  );
};
