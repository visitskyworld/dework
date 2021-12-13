import React, { FC, useCallback } from "react";
import { Avatar, AvatarProps, Tooltip, TooltipProps } from "antd";
import * as Icons from "@ant-design/icons";
import { User } from "../graphql/types";
import { colorFromUuid } from "../util/colorFromUuid";
import { useNavigateToProfile } from "../util/navigation";
import { eatClick } from "../util/eatClick";

interface Props extends AvatarProps {
  user: User;
  linkToProfile?: boolean;
  tooltip?: Partial<TooltipProps>;
}

export const UserAvatar: FC<Props> = ({
  user,
  linkToProfile,
  tooltip,
  ...otherProps
}) => {
  const navigateToProfile = useNavigateToProfile();
  const handleClick = useCallback(
    (event) => {
      eatClick(event);
      navigateToProfile(user);
    },
    [user, navigateToProfile]
  );

  return (
    <Tooltip title={user.username} placement="top" {...tooltip}>
      <Avatar
        src={user.imageUrl}
        style={{
          backgroundColor: colorFromUuid(user.id),
          cursor: linkToProfile ? "pointer" : undefined,
          ...otherProps.style,
        }}
        icon={user.username?.[0]?.toUpperCase() ?? <Icons.UserOutlined />}
        // @ts-ignore
        onClick={linkToProfile ? handleClick : undefined}
        {...otherProps}
      />
    </Tooltip>
  );
};
