import React, { FC } from "react";
import { Form, Checkbox } from "antd";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";

export const ImportExistingGithubIssuesCheckbox: FC = () => (
  <Form.Item
    name={["options", "importExistingIssues"]}
    valuePropName="checked"
    initialValue={true}
  >
    <Checkbox>
      Import existing Github Issues to Dework
      <QuestionmarkTooltip
        title="Easily move all your Github issues into Dework. New issues will be added and updated automatically."
        marginLeft={8}
      />
    </Checkbox>
  </Form.Item>
);
