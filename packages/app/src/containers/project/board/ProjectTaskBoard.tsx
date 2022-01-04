import React, { FC, useMemo } from "react";
import { useProject, useProjectTasks } from "../hooks";
import { TaskBoard } from "./TaskBoard";
import * as Icons from "@ant-design/icons";
import { TaskStatus } from "@dewo/app/graphql/types";
import { TaskBoardColumnEmptyProps } from "./TaskBoardColumnEmtpy";

interface Props {
  projectId: string;
}

const empty: Record<TaskStatus, TaskBoardColumnEmptyProps> = {
  [TaskStatus.BACKLOG]: {
    title: "Contributors can create suggestions and vote on them",
    icon: <Icons.BulbOutlined />,
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
  const project = useProject(projectId);
  const tasks = useProjectTasks(projectId, "cache-and-network")?.tasks;
  const statuses = useMemo(
    () => [
      ...(!!project?.options?.showBacklogColumn ? [TaskStatus.BACKLOG] : []),
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.IN_REVIEW,
      TaskStatus.DONE,
    ],
    [project?.options?.showBacklogColumn]
  );
  if (!tasks) return null;
  return (
    <TaskBoard
      tasks={tasks}
      projectId={projectId}
      empty={empty}
      statuses={statuses}
    />
  );
};
