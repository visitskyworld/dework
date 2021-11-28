import { TaskBoard } from "@dewo/app/components/TaskBoard";
import { Button, Card, Input } from "antd";
import React, { FC, useCallback, useState } from "react";

interface AddTaskStatusRowProps {
  onAdd(label: string): void;
}

export const AddTaskStatusRow: FC<AddTaskStatusRowProps> = ({ onAdd }) => {
  const [label, setLabel] = useState("");
  const handleSubmit = useCallback(() => onAdd(label), [onAdd, label]);
  return (
    <>
      <Card
        size="small"
        children={
          <Input.Group compact style={{ display: "flex" }}>
            <Input
              placeholder="Create New Column"
              value={label}
              onPressEnter={handleSubmit}
              onChange={(e) => setLabel(e.target.value)}
            />
            {!!label && (
              <Button type="primary" onClick={handleSubmit}>
                Create
              </Button>
            )}
          </Input.Group>
        }
      />
      <TaskBoard tasks={[]} onChange={console.log} />
    </>
  );
};
