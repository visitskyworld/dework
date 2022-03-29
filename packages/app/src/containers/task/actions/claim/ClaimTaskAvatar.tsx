import React, { FC } from "react";
import { Avatar, AvatarProps } from "antd";

export const ClaimTaskAvatar: FC<AvatarProps> = (props) => (
  <Avatar {...props} className="ant-avatar-white" />
);
