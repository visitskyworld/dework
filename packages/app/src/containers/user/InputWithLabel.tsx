import React from "react";
import { Form, Input, Row, Typography } from "antd";

interface InputWithLabelProps {
  name: string;
  label: string;
  placeholder: string;
}

export const InputWithLabel = ({
  name,
  label,
  placeholder,
}: InputWithLabelProps) => (
  <Row style={{ position: "relative" }}>
    <Typography.Text
      type="secondary"
      className="ant-typography-caption"
      style={{
        position: "absolute",
        top: 6,
        left: 12,
      }}
    >
      {label}
    </Typography.Text>
    <Form.Item name={name} style={{ flex: 1, margin: 0 }}>
      <Input
        placeholder={placeholder}
        style={{
          paddingTop: 18,
          paddingLeft: 12,
          paddingBottom: 4,
        }}
      />
    </Form.Item>
  </Row>
);
