import { CheckCircleOutlined } from "@ant-design/icons";
import { Form, List, Switch } from "antd";
import React, { FC, useCallback } from "react";

const Component: FC<{
  checked?: boolean;
  onChange?(checked: boolean): void;
}> = ({ checked, onChange }) => {
  const toggle = useCallback(() => onChange?.(!checked), [checked, onChange]);
  return (
    <List.Item
      style={{ marginBottom: 4 }}
      actions={[
        <Switch
          key="switch"
          size="small"
          checked={checked}
          onChange={onChange}
        />,
      ]}
      onClick={toggle}
    >
      <List.Item.Meta
        avatar={<CheckCircleOutlined />}
        title="Include Subtasks"
      />
    </List.Item>
  );
};

export const IncludeSubtasksRow: FC = () => (
  <Form.Item
    name="includeSubtasks"
    valuePropName="checked"
    children={<Component />}
  />
);
