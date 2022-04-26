import React, { FC } from "react";
import { Form, Checkbox } from "antd";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";

type Props = {
  hidden: boolean;
};

export const ImportGithubIssuesFormItem: FC<Props> = ({ hidden }) => (
  <Form.Item
    name="githubImportIssues"
    valuePropName="checked"
    hidden={hidden}
    style={{ margin: 0 }}
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
