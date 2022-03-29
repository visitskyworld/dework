import React, { FC } from "react";
import { Checkbox, Form } from "antd";

export const ProjectSettingsContributorSuggestions: FC = () => (
  <Form.Item
    name={["options", "showBacklogColumn"]}
    valuePropName="checked"
    label="Contributor Suggestions"
    tooltip="Show a tab where contributors can suggest and vote on tasks."
    style={{ margin: 0 }}
  >
    <Checkbox>Enable Community Suggestions Tab</Checkbox>
  </Form.Item>
);
