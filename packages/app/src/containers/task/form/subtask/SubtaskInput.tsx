import React, { FC, useCallback, useMemo } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { Divider } from "antd";
import { TaskList, TaskListRow } from "../../list/TaskList";
import { TaskDetails, TaskStatus } from "@dewo/app/graphql/types";
import { useCreateTask } from "../../hooks";
import { usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import _ from "lodash";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { NewSubtaskInput } from "./NewSubtaskInput";

export interface SubtaskFormValues {
  name: string;
  description: string;
}

interface Props {
  projectId: string;
  task?: TaskDetails;
  value?: TaskListRow[];
  onChange?(value: TaskListRow[]): void;
}

export const SubtaskInput: FC<Props> = ({
  projectId,
  task,
  value,
  onChange,
}) => {
  const { user } = useAuthContext();
  const createTask = useCreateTask();

  const hasPermission = usePermissionFn();
  const canCreateSubtask = !task || hasPermission("update", task, "subtasks");

  const adding = useToggle();

  const handleAddTask = useCallback(
    async (newSubtask: SubtaskFormValues) => {
      try {
        adding.toggleOn();
        const subtask = !!task
          ? await createTask({
              ...newSubtask,
              parentTaskId: task.id,
              status: TaskStatus.TODO,
              ownerIds: !!user ? [user.id] : [],
              assigneeIds: [],
              projectId,
              reward: undefined,
            })
          : undefined;

        onChange?.([
          ...(value ?? []),
          {
            key: subtask?.id ?? Date.now().toString(),
            task: subtask,
            name: newSubtask.name,
            assigneeIds: [],
            status: TaskStatus.TODO,
            dueDate: subtask?.dueDate ?? null,
          },
        ]);
      } finally {
        adding.toggleOff();
      }
    },
    [adding, onChange, createTask, task, projectId, value, user]
  );

  const rows = useMemo(() => {
    if (!task) return value ?? [];
    return _(task.subtasks)
      .sortBy((task) => task.sortKey)
      .map(
        (task): TaskListRow => ({
          task,
          key: task.id,
          name: task.name,
          assigneeIds: task.assignees.map((u) => u.id),
          dueDate: task.dueDate ?? null,
          status: task.status,
        })
      )
      .value();
  }, [value, task]);

  const handleChange = useCallback(
    async (changed: Partial<TaskListRow>, prevRow: TaskListRow) =>
      onChange?.(
        rows.map((r) => (r.key === prevRow.key ? { ...r, ...changed } : r))
      ),
    [onChange, rows]
  );

  const handleDelete = useCallback(
    async (row: TaskListRow) =>
      onChange?.(rows.filter((r) => r.key !== row.key)),
    [onChange, rows]
  );

  const navigateToTask = useNavigateToTaskFn();
  const handleClick = useCallback(
    (row: TaskListRow) => !!row.task && navigateToTask(row.task.id),
    [navigateToTask]
  );

  return (
    <div>
      {!!rows.length && <Divider style={{ marginBottom: 0 }}>Subtasks</Divider>}
      <TaskList
        rows={rows}
        size="small"
        nameEditable={false}
        onClick={handleClick}
        showHeader={false}
        projectId={projectId}
        onChange={handleChange}
        onDelete={handleDelete}
      />
      {canCreateSubtask && (
        <NewSubtaskInput onSubmit={handleAddTask} disabled={adding.isOn} />
      )}
    </div>
  );
};
