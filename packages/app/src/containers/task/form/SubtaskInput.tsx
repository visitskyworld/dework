import React, { FC, useCallback, useMemo, useState } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Input, Row } from "antd";
import * as Icons from "@ant-design/icons";
import { TaskList, TaskListRow } from "../list/TaskList";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { useCreateTask } from "../hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { eatClick } from "@dewo/app/util/eatClick";

interface Props {
  projectId: string;
  taskId?: string;
  value?: TaskListRow[];
  onChange?(value: TaskListRow[]): void;
}

export const SubtaskInput: FC<Props> = ({
  projectId,
  taskId,
  value,
  onChange,
}) => {
  const createTask = useCreateTask();

  const canCreateTask = usePermission("create", {
    __typename: "Task",
  } as Task);

  const adding = useToggle();
  const [newName, setNewName] = useState("");
  const handleAddTask = useCallback(
    async (e) => {
      eatClick(e);
      if (!newName) return;
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
    },
    [adding, onChange, createTask, taskId, projectId, value, newName]
  );

  const rows = useMemo(() => value ?? [], [value]);
  const handleChange = useCallback(
    async (
      changed: Partial<TaskListRow>,
      prevValue: TaskListRow,
      index: number
    ) => {
      const newValue = [...rows];
      newValue[index] = { ...prevValue, ...changed };
      onChange?.(newValue);
    },
    [onChange, rows]
  );

  const handleDelete = useCallback(
    async (_value: TaskListRow, index: number) =>
      onChange?.(rows.filter((_v, i) => i !== index)),
    [onChange, rows]
  );

  return (
    <>
      <TaskList
        key={rows.length}
        rows={rows}
        size="small"
        showHeader={false}
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
