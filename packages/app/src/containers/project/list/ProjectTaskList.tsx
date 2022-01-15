import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import React, { FC, useCallback, useMemo } from "react";
import { TaskList, TaskListRow } from "../../task/list/TaskList";
import { useProjectTasks, useProjectTaskTags } from "../hooks";

interface Props {
  projectId: string;
}

export const ProjectTaskList: FC<Props> = ({ projectId }) => {
  const tags = useProjectTaskTags(projectId);
  const tasks = useProjectTasks(projectId, "cache-and-network")?.tasks;
  const rows = useMemo(
    () =>
      tasks?.map(
        (task): TaskListRow => ({
          task,
          assigneeIds: task.assignees.map((u) => u.id),
          name: task.name,
          status: task.status,
        })
      ),
    [tasks]
  );

  const navigateToTask = useNavigateToTaskFn();
  const handleClick = useCallback(
    (row: TaskListRow) => !!row.task && navigateToTask(row.task.id),
    [navigateToTask]
  );

  if (!rows) return null;
  return (
    <TaskList
      rows={rows}
      tags={tags}
      nameEditable={false}
      showActionButtons={true}
      defaultSortByStatus={true}
      projectId={projectId}
      style={{ marginLeft: 0, marginRight: 0, minWidth: 480, maxWidth: 960 }}
      onClick={handleClick}
    />
  );
};
