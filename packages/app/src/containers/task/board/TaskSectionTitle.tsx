import { Typography } from "antd";
import React, { CSSProperties, FC } from "react";

interface Props {
  title: string;
  style?: CSSProperties;
}

export const TaskSectionTitle: FC<Props> = ({ title, style }) => (
  <Typography.Text
    strong
    type="secondary"
    className="ant-typography-caption"
    style={style}
  >
    {title.toUpperCase()}
  </Typography.Text>
);
