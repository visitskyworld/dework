import React, { FC, ReactNode } from "react";
import { Empty, Avatar } from "antd";
import * as Icons from "@ant-design/icons";
import { TaskStatusEnum } from "@dewo/app/graphql/types";

const emptyStateTitle: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.TODO]: "Put out tasks, let contributors explore and apply",
  [TaskStatusEnum.IN_PROGRESS]: "Keep track of contributor tasks in progress",
  [TaskStatusEnum.IN_REVIEW]: "When a contributor is done, review the work",
  [TaskStatusEnum.DONE]: "Pay for completed tasks in crypto using any token",
};

const emptyStateIcon: Record<TaskStatusEnum, ReactNode> = {
  [TaskStatusEnum.TODO]: <Icons.UsergroupAddOutlined />,
  [TaskStatusEnum.IN_PROGRESS]: <Icons.ThunderboltOutlined />,
  [TaskStatusEnum.IN_REVIEW]: <Icons.SafetyOutlined />,
  [TaskStatusEnum.DONE]: <Icons.DollarCircleOutlined />,
};

interface Props {
  status: TaskStatusEnum;
}

export const TaskBoardColumnEmpty: FC<Props> = ({ status }) => (
  <Empty
    description={emptyStateTitle[status]}
    image={
      <Avatar size={64} style={{ fontSize: 32 }}>
        {emptyStateIcon[status]}
      </Avatar>
    }
    imageStyle={{
      height: 72,
      paddingLeft: 24,
      paddingRight: 24,
    }}
    style={{ padding: 8 }}
  />
);
