import React, { FC, useMemo } from "react";
import { useProjectDetails, useProjectTasks } from "../hooks";
import { TaskBoard } from "../../task/board/TaskBoard";
import * as Icons from "@ant-design/icons";
import { TaskStatus } from "@dewo/app/graphql/types";
import { TaskBoardColumnEmptyProps } from "../../task/board/TaskBoardColumnEmtpy";
import { SkeletonTaskBoard } from "../../task/board/SkeletonTaskBoard";

interface Props {
  projectId: string | undefined;
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
  const { project } = useProjectDetails(projectId);
  const tasks = useProjectTasks(projectId, "cache-and-network");
  const statuses = useMemo(
    () => [
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.IN_REVIEW,
      TaskStatus.DONE,
    ],
    []
  );

  const sections = useMemo(
    () => project?.taskSections ?? [],
    [project?.taskSections]
  );

  return tasks ? (
    <TaskBoard
      tasks={tasks}
      sections={sections}
      projectId={projectId}
      empty={empty}
      statuses={statuses}
    />
  ) : (
    <SkeletonTaskBoard />
  );
};
