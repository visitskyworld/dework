import React, { FC } from "react";
import { useProjectTasks } from "../hooks";
import { TaskBoard } from "../../task/board/TaskBoard";
import * as Icons from "@ant-design/icons";
import { TaskStatus } from "@dewo/app/graphql/types";
import { TaskBoardColumnEmptyProps } from "../../task/board/TaskBoardColumnEmtpy";
import { SkeletonTaskBoard } from "../../task/board/SkeletonTaskBoard";

interface Props {
  projectId?: string;
}

export const ProjectEmptyColumns: Record<
  TaskStatus,
  TaskBoardColumnEmptyProps
> = {
  [TaskStatus.COMMUNITY_SUGGESTIONS]: {
    title: "Contributors can create suggestions and vote on them",
    icon: <Icons.BulbOutlined />,
  },
  [TaskStatus.BACKLOG]: {
    title: "Keep track of tasks you might do someday but not now",
    icon: <Icons.ContainerOutlined />,
  },
  [TaskStatus.TODO]: {
    title: "Put out tasks, let contributors explore and apply",
    icon: <Icons.UsergroupAddOutlined />,
  },
  [TaskStatus.IN_PROGRESS]: {
    title: "Keep track of contributor tasks in progress",
    icon: <Icons.ThunderboltOutlined />,
  },
  [TaskStatus.IN_REVIEW]: {
    title: "When a contributor is done, review the work",
    icon: <Icons.SafetyOutlined />,
  },
  [TaskStatus.DONE]: {
    title: "Pay for completed tasks in crypto using any token",
    icon: <Icons.DollarCircleOutlined />,
  },
};

export const ProjectTaskBoard: FC<Props> = ({ projectId }) => {
  const tasks = useProjectTasks(projectId, "cache-and-network");

  return tasks ? (
    <TaskBoard tasks={tasks} empty={ProjectEmptyColumns} />
  ) : (
    <SkeletonTaskBoard />
  );
};
