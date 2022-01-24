import React, { FC, useCallback, useMemo, useState } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Input, Row } from "antd";
import * as Icons from "@ant-design/icons";
import { TaskList, TaskListRow } from "../list/TaskList";
import { TaskDetails, TaskStatus } from "@dewo/app/graphql/types";
import { useCreateTask } from "../hooks";
import { usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { eatClick } from "@dewo/app/util/eatClick";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import _ from "lodash";

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
  const [newName, setNewName] = useState("");
  const handleAddTask = useCallback(
    async (e) => {
      eatClick(e);
      if (!newName) return;
      try {
        adding.toggleOn();
        const subtask = !!task
          ? await createTask({
              name: newName,
              parentTaskId: task.id,
              status: TaskStatus.TODO,
              ownerId: user?.id,
              assigneeIds: [],
              projectId,
            })
          : undefined;

        onChange?.([
          ...(value ?? []),
          {
            key: subtask?.id ?? Date.now().toString(),
            task: subtask,
            name: newName,
            assigneeIds: [],
            status: TaskStatus.TODO,
          },
        ]);
        setNewName("");
      } finally {
        adding.toggleOff();
      }
    },
    [adding, onChange, createTask, task, projectId, value, user?.id, newName]
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

  return (
    <>
      <TaskList
        rows={rows}
        size="small"
        showHeader={false}
        projectId={projectId}
        onChange={handleChange}
        onDelete={handleDelete}
      />
      {canCreateSubtask && (
        <Row align="middle" style={{ gap: 16 }}>
          <Button
            icon={<Icons.PlusOutlined />}
            shape="circle"
            size="small"
            type="ghost"
            loading={adding.isOn}
            onClick={!!newName ? handleAddTask : undefined}
          />
          <Input.TextArea
            autoSize
            className="dewo-field dewo-field-focus-border"
            style={{ flex: 1 }}
            placeholder="Add subtask..."
            disabled={adding.isOn}
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onPressEnter={handleAddTask}
          />
        </Row>
      )}
    </>
  );
};
