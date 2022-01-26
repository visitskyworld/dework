import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { PaymentMethod } from "@dewo/app/graphql/types";
import { Button, Space, Typography } from "antd";

interface Props {
  methods: PaymentMethod[];
  onSelect(method: PaymentMethod): void;
}

export const SelectPaymentMethodModalContent: FC<Props> = ({
  methods,
  onSelect,
}) => (
  <Space direction="vertical" style={{ width: "100%" }}>
    <Typography.Paragraph>
      There are multiple connected payment methods on this network. Select which
      one you want to pay with.
    </Typography.Paragraph>
    {methods.map((method) => (
      <Button
        key={method.id}
        className="dewo-btn-highlight"
        type="text"
        block
        icon={<Icons.CaretRightOutlined />}
        onClick={() => onSelect(method)}
      >
        <Typography.Text style={{ width: "100%", textAlign: "left" }} ellipsis>
          {method.address}
        </Typography.Text>
      </Button>
    ))}
  </Space>
);
