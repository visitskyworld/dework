import { Col, Row, Tooltip, Typography } from "antd";
import React, { CSSProperties, FC, ReactNode } from "react";
import * as Icons from "@ant-design/icons";

interface Props {
  label: ReactNode;
  tooltip?: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export const FormSection: FC<Props> = ({
  label,
  tooltip,
  children,
  style,
  className = "",
}) => (
  <Col
    className={`ant-form-item ${className}`}
    style={{ ...style, padding: 0 }}
  >
    <Row>
      <Typography.Text className="ant-form-item-label">
        <label>
          {label}
          {!!tooltip && (
            <Tooltip title={tooltip}>
              <Icons.QuestionCircleOutlined className="ant-form-item-tooltip" />
            </Tooltip>
          )}
        </label>
      </Typography.Text>
    </Row>
    {children}
  </Col>
);
