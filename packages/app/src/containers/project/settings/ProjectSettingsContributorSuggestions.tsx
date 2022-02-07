import React, { FC } from "react";
import { Checkbox, Form } from "antd";

export const ProjectSettingsContributorSuggestions: FC = () => (
  <Form.Item
    name={["options", "showBacklogColumn"]}
    valuePropName="checked"
    label="Contributor Suggestions"
    tooltip="Show a column to the left of 'To Do' where contributors can suggest and vote on tasks."
    style={{ margin: 0 }}
  >
    <Checkbox>Enable Suggestions Column</Checkbox>
  </Form.Item>
);
