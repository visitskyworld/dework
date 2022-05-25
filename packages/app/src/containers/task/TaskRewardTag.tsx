import { TaskReward } from "@dewo/app/graphql/types";
import { Tag, Tooltip } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC } from "react";
import { formatTaskReward } from "./hooks";
import { AtLeast } from "@dewo/app/types/general";

interface Props {
  reward: AtLeast<TaskReward, "amount" | "token">;
}

export const TaskRewardTag: FC<Props> = ({ reward }) => (
  <Tooltip title={formatTaskReward(reward)}>
    <Tag style={{ backgroundColor: "white", color: "black", minWidth: 0 }}>
      <Icons.DollarOutlined />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {formatTaskReward(reward)}
      </span>
    </Tag>
  </Tooltip>
);
