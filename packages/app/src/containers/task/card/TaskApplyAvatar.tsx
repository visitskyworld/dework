import React, { FC } from "react";
import { Avatar, Tooltip } from "antd";
import { PersonEditIcon } from "@dewo/app/components/icons/PersonEdit";

export const TaskApplyAvatar: FC = () => (
  <Tooltip title="Apply to this task, and the task reviewer can assign it to you">
    <Avatar
      size={20}
      icon={<PersonEditIcon />}
      className="ant-avatar-blue"
      style={{ display: "grid", placeItems: "center" }}
    />
  </Tooltip>
);
