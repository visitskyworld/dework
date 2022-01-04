import { Col, Row, Typography } from "antd";
import React, { CSSProperties, FC, ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export const FormSection: FC<Props> = ({
  label,
  children,
  style,
  className = "",
}) => (
  <Col
    className={`ant-form-item ${className}`}
    style={{ ...style, padding: 0 }}
  >
    <Row>
      <Typography.Text className="ant-form-item-label">{label}</Typography.Text>
    </Row>
    {children}
  </Col>
);
