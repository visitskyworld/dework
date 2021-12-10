import React, { FC } from "react";
import { TaskBoard } from "../project/board/TaskBoard";
import { useUserTasks } from "./hooks";

interface Props {
  userId: string;
}

export const UserTaskBoard: FC<Props> = ({ userId }) => {
  const tasks = useUserTasks(userId, "cache-and-network");
  if (!tasks) return null;
  return <TaskBoard tasks={tasks} />;
};
