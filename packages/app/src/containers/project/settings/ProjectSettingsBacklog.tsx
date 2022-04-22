import React, { FC } from "react";
import { Checkbox, Form } from "antd";

export const ProjectSettingsBacklog: FC = () => (
  <Form.Item
    name={["options", "showBacklogColumn"]}
    valuePropName="checked"
    label="Backlog Column"
    tooltip="Show a column for tasks in the backlog."
    style={{ margin: 0 }}
  >
    <Checkbox>Enable Backlog Column</Checkbox>
  </Form.Item>
);
