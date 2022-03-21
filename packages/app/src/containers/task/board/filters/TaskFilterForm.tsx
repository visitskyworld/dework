import React, { FC, useCallback } from "react";
import { Button, Form, Input, Select } from "antd";
import { TaskTagSelectField } from "../../form/TaskTagSelectField";
import { TaskFilter, useTaskFilter } from "./FilterContext";

import { UserSelect } from "@dewo/app/components/form/UserSelect";
import _ from "lodash";
import { useForm } from "antd/lib/form/Form";

import {
  OrganizationDetails_projects,
  TaskStatus,
  TaskTag,
  User,
} from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "../util";

interface Props {
  users?: User[];
  tags?: TaskTag[];
  projects?: OrganizationDetails_projects[];
}

export const TaskFilterForm: FC<Props> = ({ users, tags, projects }) => {
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
      initialValues={filter}
      onValuesChange={handleChange}
      style={{ width: 320 }}
    >
      <Form.Item name="name" label="Filter by Name">
        <Input autoFocus placeholder="Filter by name..." />
      </Form.Item>
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
      {projects?.length && (
        <Form.Item name="projects" label="Filter by Project">
          <Select
            mode="multiple"
            placeholder="Select projects..."
            allowClear
            optionFilterProp="label"
          >
            {projects.map((project) => (
              <Select.Option
                key={project.id}
                value={project.id}
                label={project.name}
              >
                {project.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
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
