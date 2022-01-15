import React, { FC, useCallback, useMemo, useState } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Input, Row } from "antd";
import * as Icons from "@ant-design/icons";
import { TaskList, TaskListRowData } from "../list/TaskList";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { useCreateTask, useDeleteTask, useUpdateTask } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

interface Props {
  projectId: string;
  taskId?: string;
  value?: TaskListRowData[];
  onChange?(value: TaskListRowData[]): void;
}

export const SubtaskInput: FC<Props> = ({
  projectId,
  taskId,
  value,
  onChange,
}) => {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const canCreateTask = usePermission("create", {
    __typename: "Task",
  } as Task);

  const adding = useToggle();
  const [newName, setNewName] = useState("");
  const handleAddTask = useCallback(async () => {
    try {
      adding.toggleOn();

      const subtask = !!taskId
        ? await createTask(
            {
              name: newName,
              parentTaskId: taskId,
              status: TaskStatus.TODO,
              assigneeIds: [],
            },
            projectId
          )
        : undefined;

      onChange?.([
        ...(value ?? []),
        {
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
  }, [adding, onChange, createTask, taskId, projectId, value, newName]);

  const rows = useMemo(() => value ?? [], [value]);
  const handleChange = useCallback(
    async (
      changed: Partial<TaskListRowData>,
      prevValue: TaskListRowData,
      index: number
    ) => {
      if (!!prevValue.task) {
        await updateTask({ id: prevValue.task.id, ...changed });
      }

      const newValue = [...rows];
      newValue[index] = { ...prevValue, ...changed };
      onChange?.(newValue);
    },
    [onChange, updateTask, rows]
  );

  const handleDelete = useCallback(
    async (value: TaskListRowData, index: number) => {
      if (!!value.task) await deleteTask(value.task.id);
      onChange?.(rows.filter((_v, i) => i !== index));
    },
    [onChange, deleteTask, rows]
  );

  return (
    <>
      <TaskList
        key={rows.length}
        rows={rows}
        tags={[]}
        projectId={projectId}
        onChange={handleChange}
        onDelete={handleDelete}
      />
      {canCreateTask && (
        <Row align="middle" style={{ gap: 16 }}>
          <Button
            icon={<Icons.PlusOutlined />}
            shape="circle"
            size="small"
            type="ghost"
            loading={adding.isOn}
            onClick={!!newName ? handleAddTask : undefined}
          />
          <Input
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
