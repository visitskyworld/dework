import React, { FC, ReactNode } from "react";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { TaskStatus } from "@dewo/app/graphql/types";
import { Avatar, AvatarProps } from "antd";

const colorByStatus: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: Colors.orange.primary!,
  [TaskStatus.TODO]: Colors.magenta.primary!,
  [TaskStatus.IN_PROGRESS]: Colors.yellow.primary!,
  [TaskStatus.IN_REVIEW]: Colors.blue.primary!,
  [TaskStatus.DONE]: Colors.green.primary!,
};

const iconByStatus: Record<TaskStatus, ReactNode> = {
  [TaskStatus.BACKLOG]: <Icons.BulbOutlined />,
  [TaskStatus.TODO]: <Icons.ClockCircleOutlined />,
  [TaskStatus.IN_PROGRESS]: <Icons.ThunderboltOutlined />,
  [TaskStatus.IN_REVIEW]: <Icons.SyncOutlined />,
  [TaskStatus.DONE]: <Icons.CheckOutlined />,
};

interface Props extends AvatarProps {
  status: TaskStatus;
}

export const TaskStatusAvatar: FC<Props> = ({ status, ...avatarProps }) => {
  const color = colorByStatus[status];
  return (
    <Avatar
      {...avatarProps}
      icon={iconByStatus[status]}
      style={{
        backgroundColor: `${color}22`,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: color,
        color: color,
      }}
    />
  );
};
