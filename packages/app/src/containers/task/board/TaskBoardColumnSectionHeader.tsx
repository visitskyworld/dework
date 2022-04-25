import { Button, Row } from "antd";
import React, { FC, ReactNode } from "react";
import * as Icons from "@ant-design/icons";
import { TaskSection } from "@dewo/app/graphql/types";
import { TaskSectionOptionButton } from "./TaskSectionOptionButton";

interface Props {
  title: string;
  collapsed: boolean;
  section?: TaskSection;
  button?: ReactNode;
  onChangeCollapsed(): void;
}

export const TaskBoardColumnSectionHeader: FC<Props> = ({
  title,
  collapsed,
  section,
  button,
  onChangeCollapsed,
}) => (
  <Row
    align="middle"
    className="dewo-task-board-column-section-title"
    style={{ minHeight: 32 }}
  >
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

    <div style={{ flex: 1 }} />
    {!!section && <TaskSectionOptionButton section={section} />}
    {button}
  </Row>
);
