import React, { FC, useCallback, useRef, useState } from "react";
import { Form, Button, Input, Select, FormInstance } from "antd";
import { useCreateTask } from "../hooks";
import { CreateTaskInput, Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "./util";

interface TaskCreateFormProps {
  initialValues?: Partial<CreateTaskInput>;
  onCreated(project: Task): unknown;
}

export const TaskCreateForm: FC<TaskCreateFormProps> = ({
  initialValues,
  onCreated,
}) => {
  const formRef = useRef<FormInstance<CreateTaskInput>>(null);
  const createTask = useCreateTask();

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
