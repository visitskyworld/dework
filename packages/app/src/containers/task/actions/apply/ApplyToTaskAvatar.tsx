import React, { FC } from "react";
import { Avatar, AvatarProps, Tooltip } from "antd";
import { PersonEditIcon } from "@dewo/app/components/icons/PersonEdit";

export const ApplyToTaskAvatar: FC<AvatarProps> = (props) => (
  <Tooltip title="Apply to this task, and the task reviewer can assign it to you">
    <Avatar
      {...props}
      icon={<PersonEditIcon />}
      className="ant-avatar-blue"
      style={{ display: "grid", placeItems: "center", ...props.style }}
    />
  </Tooltip>
);
