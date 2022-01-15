import React, { FC, useCallback, useMemo, useState } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Input, Row } from "antd";
import * as Icons from "@ant-design/icons";
import { TaskList, TaskListRowData } from "../list/TaskList";
import { TaskStatus } from "@dewo/app/graphql/types";

interface Props {
  projectId: string;
  value?: TaskListRowData[];
  onChange?(value: TaskListRowData[]): void;
}

export const SubtaskInput: FC<Props> = ({ projectId, value, onChange }) => {
  const adding = useToggle();
  const [newName, setNewName] = useState("");
  const handleAddTask = useCallback(async () => {
    try {
      adding.toggleOn();
      await onChange?.([
        ...(value ?? []),
        { name: newName, assigneeIds: [], status: TaskStatus.TODO },
      ]);
      setNewName("");
    } finally {
      adding.toggleOff();
    }
  }, [adding, onChange, value, newName]);

  const rows = useMemo(() => value ?? [], [value]);
  const handleChange = useCallback(
    (
      changed: Partial<TaskListRowData>,
      prevValue: TaskListRowData,
      index: number
    ) => {
      const newValue = [...rows];
      newValue[index] = { ...prevValue, ...changed };
      onChange?.(newValue);
    },
    [onChange, rows]
  );

  return (
    <>
      <TaskList
        key={rows.length}
        rows={rows}
        tags={[]}
        projectId={projectId}
        onChange={handleChange}
        // onAddTask={handleAddTask}
      />
      <Row align="middle" style={{ paddingLeft: 8, gap: 16, marginBottom: 16 }}>
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
    </>
  );
};
