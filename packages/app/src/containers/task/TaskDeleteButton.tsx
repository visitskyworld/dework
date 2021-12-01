import { Task } from "@dewo/app/graphql/types";
import { Button } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { useDeleteTask } from "./hooks";

interface TaskDeleteButtonProps {
  task: Task;
}

export const TaskDeleteButton: FC<TaskDeleteButtonProps> = ({ task }) => {
  const [loading, setLoading] = useState(false);
  const deleteTask = useDeleteTask();
  const router = useRouter();
  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      await deleteTask(task);
      await router.push(
        `/organization/${router.query.organizationId}/project/${router.query.projectId}`
      );
    } finally {
      setLoading(false);
    }
  }, [deleteTask, task, router]);
  return (
    <Button
      type="ghost"
      loading={loading}
      className="hover:ant-btn-dangerous"
      onClick={handleClick}
    >
      Delete
    </Button>
  );
};
