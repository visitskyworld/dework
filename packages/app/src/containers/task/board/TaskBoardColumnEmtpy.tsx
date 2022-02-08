import React, { FC, ReactNode } from "react";
import { Empty, Avatar } from "antd";

export interface TaskBoardColumnEmptyProps {
  title: ReactNode;
  icon: ReactNode;
}

export const TaskBoardColumnEmpty: FC<TaskBoardColumnEmptyProps> = ({
  title,
  icon,
}) => (
  <Empty
    description={title}
    image={
      <Avatar size={64} style={{ fontSize: 32 }}>
        {icon}
      </Avatar>
    }
    imageStyle={{ height: 72, paddingLeft: 24, paddingRight: 24 }}
    style={{ padding: 8 }}
  />
);
