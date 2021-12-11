import React, { FC } from "react";
import { Avatar, AvatarProps, Tooltip } from "antd";
import * as Icons from "@ant-design/icons";
import { Organization } from "../graphql/types";
import { colorFromUuid } from "../util/colorFromUuid";

interface Props extends AvatarProps {
  organization: Organization;
}

export const OrganizationAvatar: FC<Props> = ({
  organization,
  ...otherProps
}) => (
  <Tooltip title={organization.name} placement="top">
    <Avatar
      src={organization.imageUrl}
      style={{
        backgroundColor: colorFromUuid(organization.id),
        ...otherProps.style,
      }}
      icon={organization.name?.[0]?.toUpperCase() ?? <Icons.TeamOutlined />}
      {...otherProps}
    />
  </Tooltip>
);
