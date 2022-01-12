import React, { FC } from "react";
import { Avatar, AvatarProps, Tooltip, TooltipProps } from "antd";
import * as Icons from "@ant-design/icons";
import { Organization } from "../graphql/types";
import { colorFromUuid } from "../util/colorFromUuid";

interface Props extends AvatarProps {
  organization: Pick<Organization, "id" | "imageUrl" | "name">;
  tooltip?: Partial<TooltipProps>;
}

export const OrganizationAvatar: FC<Props> = ({
  organization,
  tooltip,
  className = "",
  ...otherProps
}) => (
  <Tooltip title={organization.name} placement="top" {...tooltip}>
    <Avatar
      src={organization.imageUrl}
      style={{
        backgroundColor: !organization.imageUrl
          ? colorFromUuid(organization.id)
          : undefined,
        ...otherProps.style,
      }}
      icon={organization.name?.[0]?.toUpperCase() ?? <Icons.TeamOutlined />}
      {...otherProps}
      className={`bg-component ${className}`}
    />
  </Tooltip>
);
