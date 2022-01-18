import React, { FC } from "react";
import { Checkbox, Form, Radio } from "antd";
import { ProjectVisibility } from "@dewo/app/graphql/types";
import { UseToggleHook } from "@dewo/app/util/hooks";
import { AdvancedSectionCollapse } from "@dewo/app/components/AdvancedSectionCollapse";

interface Props {
  toggle: UseToggleHook;
}
export const ProjectSettingsFormFields: FC<Props> = ({ toggle }) => {
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

      <AdvancedSectionCollapse toggle={toggle}>
        <Form.Item
          name={["options", "showBacklogColumn"]}
          valuePropName="checked"
          label="Contributor Suggestions"
          tooltip="Show a column to the left of 'To Do' where contributors can suggest and vote on tasks."
        >
          <Checkbox>Enable Suggestions Column</Checkbox>
        </Form.Item>
      </AdvancedSectionCollapse>
    </>
  );
};
