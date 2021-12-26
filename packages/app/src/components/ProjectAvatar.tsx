import React, { FC } from "react";
import { Avatar, AvatarProps, Tooltip, TooltipProps } from "antd";
import * as Icons from "@ant-design/icons";
import { Project } from "../graphql/types";
import { colorFromUuid } from "../util/colorFromUuid";

interface Props extends AvatarProps {
  project: Project;
  tooltip?: Partial<TooltipProps>;
}

export const ProjectAvatar: FC<Props> = ({
  project,
  tooltip,
  ...otherProps
}) => (
  <Tooltip title={project.name} placement="top" {...tooltip}>
    <Avatar
      // src={project.imageUrl}
      style={{
        backgroundColor: colorFromUuid(project.id),
        ...otherProps.style,
      }}
      icon={project.name?.[0]?.toUpperCase() ?? <Icons.TeamOutlined />}
      {...otherProps}
    />
  </Tooltip>
);
