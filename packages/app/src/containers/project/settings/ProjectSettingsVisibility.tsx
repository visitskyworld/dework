import React, { FC } from "react";
import { Form, Radio } from "antd";
import { ProjectVisibility } from "@dewo/app/graphql/types";

export const ProjectSettingsVisibility: FC = () => (
  <Form.Item
    label="Visibility"
    name="visibility"
    tooltip="By default all projects are public. Make a project private if you only want to share it with invited contributors."
    style={{ margin: 0 }}
  >
    <Radio.Group>
      <Radio.Button value={ProjectVisibility.PUBLIC}>Public</Radio.Button>
      <Radio.Button value={ProjectVisibility.PRIVATE}>Private</Radio.Button>
    </Radio.Group>
  </Form.Item>
);
