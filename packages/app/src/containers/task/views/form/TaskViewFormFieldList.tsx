import { RightOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { HeadlessCollapse } from "@dewo/app/components/HeadlessCollapse";
import { TaskViewField } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Form, List, Select } from "antd";
import React, { FC } from "react";

const options = [
  { value: TaskViewField.status, label: "Status" },
  { value: TaskViewField.gating, label: "Gating" },
  { value: TaskViewField.number, label: "ID" },
  { value: TaskViewField.name, label: "Name" },
  { value: TaskViewField.priority, label: "Priority" },
  { value: TaskViewField.dueDate, label: "Due Date" },
  { value: TaskViewField.skills, label: "Skills" },
  { value: TaskViewField.tags, label: "Tags" },
  { value: TaskViewField.reward, label: "Reward" },
  { value: TaskViewField.assignees, label: "Assignees" },
  { value: TaskViewField.button, label: "CTA" },
];

export const TaskViewFormFieldList: FC = () => {
  const show = useToggle();
  return (
    <>
      <List.Item
        style={{ marginBottom: 4 }}
        actions={[
          <Button
            size="small"
            type="text"
            className="text-secondary"
            onClick={show.toggle}
          >
            Customize <RightOutlined />
          </Button>,
        ]}
      >
        <List.Item.Meta avatar={<UnorderedListOutlined />} title="Fields" />
      </List.Item>
      <HeadlessCollapse expanded={show.isOn}>
        <Form.Item
          name="fields"
          style={{ margin: 0 }}
          rules={[
            { type: "array", min: 1, message: "Select at least one property" },
          ]}
        >
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="label"
            placeholder="Select fields..."
            style={{ width: "100%" }}
          >
            {options.map((option) => (
              <Select.Option
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </HeadlessCollapse>
    </>
  );
};
