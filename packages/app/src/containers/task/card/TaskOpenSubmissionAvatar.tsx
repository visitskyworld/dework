import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";

export const TaskOpenSubmissionAvatar: FC = () => (
  <Tooltip title="This is a contest bounty. Anyone can create a submission and the reviewer will pick the winner.">
    <Avatar
      size={20}
      icon={<Icons.TrophyFilled />}
      className="ant-avatar-yellow"
      style={{ display: "grid", placeItems: "center" }}
    />
  </Tooltip>
);
