import React, { FC, useCallback } from "react";
import { Button, Form, Select } from "antd";
import { TaskTagSelectField } from "../../form/TaskTagSelectField";
import { TaskFilter, useTaskFilter } from "./FilterContext";

import { UserSelect } from "@dewo/app/components/form/UserSelect";
import _ from "lodash";
import { useForm } from "antd/lib/form/Form";

import { TaskStatus, TaskTag, User } from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "../util";

interface Props {
  users?: User[];
  tags?: TaskTag[];
}

export const TaskFilterForm: FC<Props> = ({ users, tags }) => {
  const [form] = useForm<TaskFilter>();
  const { filter, onChange } = useTaskFilter();
  const handleChange = useCallback(
    (_changed: Partial<TaskFilter>, values: TaskFilter) => onChange(values),
    [onChange]
  );
  const resetFilter = useCallback(() => {
    form.resetFields();
    onChange({});
  }, [form, onChange]);

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleChange}
      style={{ width: 320 }}
    >
      <TaskTagSelectField label="Filter by Tag" tags={tags} />
      <Form.Item name="assigneeIds" label="Filter by Assignee">
        <UserSelect
          mode="multiple"
          placeholder="Select assignees..."
          users={users}
        />
      </Form.Item>
      <Form.Item name="ownerIds" label="Filter by Reviewer">
        <UserSelect
          mode="multiple"
          placeholder="Select reviewers..."
          users={users}
        />
      </Form.Item>
      <Form.Item name="statuses" label="Filter by Status">
        <Select mode="multiple" placeholder="Select statuses...">
          {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((status) => (
            <Select.Option key={status} value={status}>
              {STATUS_LABEL[status]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {!_.isEmpty(filter) && (
        <Button
          type="text"
          className="dewo-btn-highlight"
          onClick={resetFilter}
        >
          Reset Filters
        </Button>
      )}
    </Form>
  );
};
