import React, { FC } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Checkbox, Divider, Form, Radio } from "antd";
import * as Icons from "@ant-design/icons";
import { ProjectVisibility } from "@dewo/app/graphql/types";

export const ProjectSettingsFormFields: FC = () => {
  const advancedOptions = useToggle(true);
  return (
    <>
      <Form.Item
        label="Visibility"
        name="visibility"
        tooltip="By default all projects are public. Make a project private if you only want to share it with invited contributors."
      >
        <Radio.Group>
          <Radio.Button value={ProjectVisibility.PUBLIC}>Public</Radio.Button>
          <Radio.Button value={ProjectVisibility.PRIVATE}>Private</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Divider plain>
        <Button
          type="text"
          style={{ padding: "0 8px", height: "unset" }}
          className="text-secondary"
          onClick={advancedOptions.toggle}
        >
          Advanced
          {advancedOptions.isOn ? <Icons.UpOutlined /> : <Icons.DownOutlined />}
        </Button>
      </Divider>

      <Form.Item hidden={!advancedOptions.isOn}>
        <Form.Item
          name={["options", "showBacklogColumn"]}
          valuePropName="checked"
          label="Contributor Suggestions"
          tooltip="Show a column to the left of 'To Do' where contributors can suggest and vote on tasks."
        >
          <Checkbox>Enable Suggestions Column</Checkbox>
        </Form.Item>
      </Form.Item>
    </>
  );
};
