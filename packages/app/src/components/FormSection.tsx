import { Col, Row, Typography } from "antd";
import React, { FC, ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  className?: string;
}

export const FormSection: FC<Props> = ({ label, children, className = "" }) => (
  <Col className={`ant-form-item ${className}`} style={{ padding: 0 }}>
    <Row>
      <Typography.Text className="ant-form-item-label">{label}</Typography.Text>
    </Row>
    {children}
  </Col>
);
