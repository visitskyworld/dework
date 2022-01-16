import React, { FC } from "react";
import { Avatar, Dropdown } from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { FeedbackDropdown } from "./FeedbackDropdown";

export const FeedbackButton: FC = () => {
  const { user } = useAuthContext();

  if (!user) return null;
  return (
    <div
      title="Need help?"
      style={{ position: "absolute", bottom: 16, right: 16 }}
    >
      <Dropdown
        key="avatar"
        placement="bottomLeft"
        trigger={["click"]}
        overlay={<FeedbackDropdown />}
      >
        <Avatar>
          <Icons.MessageOutlined />
        </Avatar>
      </Dropdown>
    </div>
  );
};
