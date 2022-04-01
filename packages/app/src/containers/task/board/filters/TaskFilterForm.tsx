import React, { FC, useCallback } from "react";
import { Button, Divider, Form, Input, Select } from "antd";
import { TaskTagSelectField } from "../../form/TaskTagSelectField";
import { TaskFilter, useTaskFilter } from "./FilterContext";
import { UserSelect } from "@dewo/app/components/form/UserSelect";
import _ from "lodash";
import { useForm } from "antd/lib/form/Form";
import {
  OrganizationDetails,
  TaskStatus,
  TaskTag,
  User,
} from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "../util";
import { TaskQuickFilterField } from "./TaskQuickFilterField";

interface Props {
  users?: User[];
  tags?: TaskTag[];
  projects?: OrganizationDetails["projects"];
}

export const TaskFilterForm: FC<Props> = ({ users, tags, projects }) => {
  const [form] = useForm<TaskFilter>();
  const { filter, onChange } = useTaskFilter();
  const handleChange = useCallback(
    (_changed: Partial<TaskFilter>, values: TaskFilter) => onChange(values),
    [onChange]
  );
  const resetFilter = useCallback(() => {
    onChange({});
    // Do this async, otherwise the form will render with initialValues set to the current filter value
    setTimeout(form.resetFields);
  }, [form, onChange]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={filter}
      onValuesChange={handleChange}
      style={{ width: 320 }}
    >
      <Form.Item name="quickFilter" label="Quick Filters">
        <TaskQuickFilterField />
      </Form.Item>
      <Divider />

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
          {[
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.IN_REVIEW,
            TaskStatus.DONE,
          ].map((status) => (
            <Select.Option key={status} value={status}>
              {STATUS_LABEL[status]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {projects?.length && (
        <Form.Item name="projectIds" label="Filter by Project">
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
