import React, { FC } from "react";
import { Avatar, AvatarProps, Tooltip, TooltipProps } from "antd";
import * as Icons from "@ant-design/icons";
import { User } from "../graphql/types";
import { colorFromUuid } from "../util/colorFromUuid";

interface Props extends AvatarProps {
  user: User;
  tooltip?: Partial<TooltipProps>;
}

export const UserAvatar: FC<Props> = ({ user, tooltip, ...otherProps }) => (
  <Tooltip title={user.username} placement="top" {...tooltip}>
    <Avatar
      src={user.imageUrl}
      style={{
        backgroundColor: colorFromUuid(user.id),
        ...otherProps.style,
      }}
      icon={user.username?.[0]?.toUpperCase() ?? <Icons.UserOutlined />}
      {...otherProps}
    />
  </Tooltip>
);
