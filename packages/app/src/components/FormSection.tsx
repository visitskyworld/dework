import { Col, Row, Typography } from "antd";
import React, { FC, ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

export const FormSection: FC<Props> = ({ label, children }) => (
  <Col className="ant-form-item" style={{ padding: 0 }}>
    <Row>
      <Typography.Text className="ant-form-item-label">{label}</Typography.Text>
    </Row>
    {children}
  </Col>
);
