import React, { FC } from "react";
import { useProjectTasks } from "../hooks";
import { TaskBoard } from "./TaskBoard";
import * as Icons from "@ant-design/icons";
import { TaskStatus } from "@dewo/app/graphql/types";
import { TaskBoardColumnEmptyProps } from "./TaskBoardColumnEmtpy";

interface Props {
  projectId: string;
}

const empty: Record<TaskStatus, TaskBoardColumnEmptyProps> = {
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
  const project = useProjectTasks(projectId, "cache-and-network");
  if (!project) return null;
  return (
    <TaskBoard tasks={project.tasks} projectId={projectId} empty={empty} />
  );
};
