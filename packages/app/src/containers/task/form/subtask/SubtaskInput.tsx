import React, { FC, useCallback, useMemo } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { DragDropContext, DragDropContextProps } from "react-beautiful-dnd";
import { Divider } from "antd";
import { TaskList, TaskListRow } from "../../list/TaskList";
import { TaskDetails, TaskStatus } from "@dewo/app/graphql/types";
import { useCreateTask, useUpdateTask } from "../../hooks";
import { usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import _ from "lodash";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { NewSubtaskInput } from "./NewSubtaskInput";
import { getSortKeyBetween } from "../../board/util";

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
  const updateTask = useUpdateTask();

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
            description: newSubtask.description,
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

  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    async (result) => {
      if (result.reason !== "DROP" || !result.destination) return;

      const {
        source: { index: oldIndex },
        destination: { index: newIndex },
      } = result;

      if (!task && value) {
        const updatedValue = value;
        const temp = updatedValue[oldIndex];
        updatedValue.splice(oldIndex, 1);
        updatedValue.splice(newIndex, 0, temp);
        onChange?.(updatedValue);
      } else if (task) {
        const sortedTasks = _.sortBy(task.subtasks, (t) => t.sortKey);

        const indexExcludingItself =
          oldIndex < newIndex ? newIndex + 1 : newIndex;

        const taskAbove = sortedTasks[indexExcludingItself - 1];
        const taskBelow = sortedTasks[indexExcludingItself];
        const newKey = getSortKeyBetween(
          taskAbove,
          taskBelow,
          (t) => t.sortKey
        );
        await updateTask(
          {
            id: sortedTasks[oldIndex].id,
            sortKey: newKey,
          },
          sortedTasks[oldIndex]
        );
      }
    },
    [task, value, onChange, updateTask]
  );

  const rows = useMemo(() => {
    if (!task) return value ?? [];
    return _.sortBy(task.subtasks, (t) => t.sortKey).map(
      (task): TaskListRow => ({
        task,
        key: task.id,
        name: task.name,
        description: task.description ?? "",
        assigneeIds: task.assignees.map((u) => u.id),
        dueDate: task.dueDate ?? null,
        status: task.status,
      })
    );
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskList
          rows={rows}
          size="small"
          editable={!!canCreateSubtask}
          onClick={handleClick}
          showHeader={false}
          projectId={projectId}
          canCreateSubtask={!!canCreateSubtask}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      </DragDropContext>
      {canCreateSubtask && (
        <NewSubtaskInput onSubmit={handleAddTask} disabled={adding.isOn} />
      )}
    </div>
  );
};
