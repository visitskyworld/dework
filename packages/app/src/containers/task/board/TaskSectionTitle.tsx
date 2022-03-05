import { Button, Typography } from "antd";
import React, { CSSProperties, FC } from "react";
import * as Icons from "@ant-design/icons";

interface Props {
  title: string;
  collapsed: boolean;
  onChangeCollapsed(): void;
  style?: CSSProperties;
}

export const TaskSectionTitle: FC<Props> = ({
  title,
  collapsed,
  style,
  onChangeCollapsed,
}) => {
  return (
    <>
      <Typography.Text
        strong
        type="secondary"
        className="ant-typography-caption"
        style={style}
      >
        {title.toUpperCase()}
      </Typography.Text>
      <Button
        type="text"
        size="small"
        className="text-secondary"
        icon={
          collapsed ? <Icons.CaretUpOutlined /> : <Icons.CaretDownOutlined />
        }
        onClick={onChangeCollapsed}
      />
    </>
  );
};
