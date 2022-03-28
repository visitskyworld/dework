import { TaskReward } from "@dewo/app/graphql/types";
import { Tag, Tooltip } from "antd";
import * as Icons from "@ant-design/icons";
import React, { CSSProperties, FC } from "react";
import { formatTaskReward } from "./hooks";

interface Props {
  reward: TaskReward;
  style?: CSSProperties;
}

export const TaskRewardTag: FC<Props> = ({ reward, style }) => (
  <Tooltip title={formatTaskReward(reward)}>
    <Tag style={{ backgroundColor: "white", color: "black", ...style }}>
      <Icons.DollarOutlined />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {formatTaskReward(reward)}
      </span>
    </Tag>
  </Tooltip>
);
