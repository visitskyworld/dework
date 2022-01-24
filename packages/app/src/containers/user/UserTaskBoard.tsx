import React, { FC } from "react";
import { TaskStatus } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { TaskBoard } from "../task/board/TaskBoard";
import { useUserTasks } from "./hooks";
import { TaskBoardColumnEmptyProps } from "../task/board/TaskBoardColumnEmtpy";
import { SkeletonTaskBoard } from "../task/board/SkeletonTaskBoard";

interface Props {
  userId: string;
}

const empty: Partial<Record<TaskStatus, TaskBoardColumnEmptyProps>> = {
  [TaskStatus.TODO]: {
    title: "First apply to tasks, then the ones assigned to you appear here",
    icon: <Icons.UsergroupAddOutlined />,
  },
  [TaskStatus.IN_PROGRESS]: {
    title: "Here drag in all tasks that you have in progress here",
    icon: <Icons.ThunderboltOutlined />,
  },
  [TaskStatus.IN_REVIEW]: {
    title: "When you're done with a task, put it here for review by the DAO",
    icon: <Icons.SafetyOutlined />,
  },
  [TaskStatus.DONE]: {
    title: "Keep track of your completed tasks and reward payment here",
    icon: <Icons.DollarCircleOutlined />,
  },
};

export const UserTaskBoard: FC<Props> = ({ userId }) => {
  const tasks = useUserTasks(userId, "cache-and-network");
  return tasks ? (
    <TaskBoard tasks={tasks} empty={empty} />
  ) : (
    <SkeletonTaskBoard />
  );
};
