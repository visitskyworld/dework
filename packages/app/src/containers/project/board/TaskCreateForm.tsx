import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { Tag, Form, Button, Input, Select, FormInstance } from "antd";
import { useCreateTask } from "../hooks";
import {
  CreateTaskInput,
  ProjectDetails,
  Task,
  TaskStatusEnum,
  TaskTag,
} from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "./util";
import { TaskTagCreateForm } from "./TaskTagCreateForm";
import _ from "lodash";
import { useRerender } from "@dewo/app/util/hooks";

interface TaskCreateFormProps {
  project: ProjectDetails;
  initialValues?: Partial<CreateTaskInput>;
  onCreated(project: Task): unknown;
}

export const TaskCreateForm: FC<TaskCreateFormProps> = ({
  project,
  initialValues,
  onCreated,
}) => {
  const formRef = useRef<FormInstance<CreateTaskInput>>(null);
  const createTask = useCreateTask();

  const tagById = useMemo(
    () => _.keyBy(project.taskTags, "id"),
    [project.taskTags]
  );

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: CreateTaskInput) => {
      try {
        setLoading(true);
        const project = await createTask(values);
        await onCreated(project);
      } finally {
        setLoading(false);
      }
    },
    [createTask, onCreated]
  );

  const rerender = useRerender();

  return (
    <Form ref={formRef} initialValues={initialValues} onFinish={handleSubmit}>
      <Form.Item
        label="Task Name"
        name="name"
        rules={[{ required: true, message: "Please enter a name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Task Description" name="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Select
          placeholder="Select a task status"
          // onChange={() => formRef.current?.setFieldsValue({})}
          allowClear
        >
          {(Object.keys(STATUS_LABEL) as TaskStatusEnum[]).map((status) => (
            <Select.Option key={status} value={status}>
              {STATUS_LABEL[status]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="tagIds" label="Tags" rules={[{ type: "array" }]}>
        <Select
          mode="multiple"
          showSearch
          placeholder="Please select favourite colors"
          optionLabelProp="label" // don't put children inside tagRender
          tagRender={(props) => (
            <Tag
              {...props}
              color={tagById[props.value as string]?.color}
              children={props.label}
            />
          )}
          dropdownRender={(menu) => (
            <>
              {menu}
              <TaskTagCreateForm
                projectId={project.id}
                onCreated={(tag) => {
                  formRef.current?.setFieldsValue({
                    tagIds: [
                      ...formRef.current?.getFieldValue("tagIds"),
                      tag.id,
                    ],
                  });
                  rerender();
                }}
              />
            </>
          )}
        >
          {project.taskTags.map((tag) => (
            <Select.Option value={tag.id} label={tag.label}>
              <Tag color={tag.color}>{tag.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="projectId" hidden rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};
