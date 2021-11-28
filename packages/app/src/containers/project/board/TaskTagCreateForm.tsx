import React, { FC, useCallback, useState } from "react";
import { Badge, Button, Form, Input, Select } from "antd";
import * as Icons from "@ant-design/icons";
import { CreateTaskTagInput, TaskTag } from "@dewo/app/graphql/types";
import { useCreateTaskTag } from "../hooks";

interface TaskTagCreateFormProps {
  projectId: string;
  onCreated(tag: TaskTag): void;
}

const colors = ["red", "green", "yellow", "blue"];
const randomColor = () => colors[Date.now() % colors.length];

export const TaskTagCreateForm: FC<TaskTagCreateFormProps> = ({
  projectId,
  onCreated,
}) => {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState(randomColor);

  const [loading, setLoading] = useState(false);
  const createTaskTag = useCreateTaskTag();
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const tag = await createTaskTag({
        label,
        color,
        projectId,
      });
      setLabel("");
      setColor(randomColor());
      onCreated(tag);
    } finally {
      setLoading(false);
    }
  }, [createTaskTag, label, color, projectId, onCreated]);

  return (
    <Form<CreateTaskTagInput>>
      <Input.Group
        compact
        style={{ display: "flex", paddingLeft: 4, paddingRight: 4 }}
      >
        <Button
          style={{ paddingLeft: 8, paddingRight: 8 }}
          disabled={!label}
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<Icons.PlusOutlined />}
        />
        <Input
          name="label"
          placeholder="Create new tag"
          value={label}
          onPressEnter={handleSubmit}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Select value={color} onChange={setColor}>
          {colors.map((color) => (
            <Select.Option value={color} label={color}>
              <Badge color={color} style={{ marginLeft: 6 }} />
            </Select.Option>
          ))}
        </Select>
      </Input.Group>
    </Form>
  );
};
