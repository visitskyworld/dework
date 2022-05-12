import React, { FC } from "react";
import { Form, Checkbox, Tag } from "antd";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";

export const CreateTasksFromIssuesCheckbox: FC = () => (
  <Form.Item
    name={["options", "importNewIssues"]}
    valuePropName="checked"
    initialValue={true}
  >
    <Checkbox>
      Create Dework tasks from new Github issues
      <Tag color="green" style={{ marginLeft: 8 }}>
        Recommended!
      </Tag>
      <QuestionmarkTooltip
        title="When a new Github issue is created, a new Dework task will automatically be created and linked to the issue."
        marginLeft={8}
      />
    </Checkbox>
  </Form.Item>
);
