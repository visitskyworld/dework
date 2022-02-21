import React, { CSSProperties, FC } from "react";
import * as Icons from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
import { PaymentStatus } from "../graphql/types";

const paymentStatusToString: Record<PaymentStatus, string> = {
  [PaymentStatus.PROCESSING]: "Processing",
  [PaymentStatus.CONFIRMED]: "Completed",
  [PaymentStatus.FAILED]: "Failed",
};

const paymentStatusToColor: Record<PaymentStatus, string> = {
  [PaymentStatus.PROCESSING]: "volcano",
  [PaymentStatus.CONFIRMED]: "green",
  [PaymentStatus.FAILED]: "red",
};

interface Props {
  status: PaymentStatus;
  style?: CSSProperties;
}

export const PaymentStatusTag: FC<Props> = ({ status, style }) => (
  <Tag color={paymentStatusToColor[status]} style={style}>
    {paymentStatusToString[status]}
    {status === PaymentStatus.PROCESSING && (
      <Tooltip title="Transactions are checked every minute, so it might take a few minutes before it shows up as confirmed in Dework.">
        {"  "}
        <Icons.QuestionCircleOutlined />
      </Tooltip>
    )}
  </Tag>
);
