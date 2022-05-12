import React, { FC } from "react";
import { Form, Checkbox } from "antd";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";

export const CreateIssuesFromTasksCheckbox: FC = () => (
  <Form.Item
    name={["options", "postTasksToGithub"]}
    valuePropName="checked"
    style={{ margin: 0 }}
  >
    <Checkbox>
      Create Github issues from new Dework tasks
      <QuestionmarkTooltip
        title="When a new Dework task is created, a Github issue will automatically be created and linked to the Dework task."
        marginLeft={8}
      />
    </Checkbox>
  </Form.Item>
);
