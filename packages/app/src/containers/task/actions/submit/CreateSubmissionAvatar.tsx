import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Avatar, AvatarProps, Tooltip } from "antd";

export const CreateSubmissionAvatar: FC<AvatarProps> = (props) => (
  <Tooltip title="This is a contest bounty. Anyone can create a submission and the reviewer will pick the winner.">
    <Avatar
      {...props}
      icon={<Icons.TrophyFilled />}
      className="ant-avatar-yellow"
      style={{ display: "grid", placeItems: "center", ...props.style }}
    />
  </Tooltip>
);
