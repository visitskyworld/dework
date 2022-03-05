import { Button } from "antd";
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
  onChangeCollapsed,
}) => {
  return (
    <Button
      type="text"
      size="small"
      className="text-secondary font-bold ant-typography-caption"
      style={{ marginLeft: -8 }}
      onClick={onChangeCollapsed}
    >
      {title.toUpperCase()}
      {collapsed ? <Icons.CaretUpOutlined /> : <Icons.CaretDownOutlined />}
    </Button>
  );
};
