import React, { useCallback, useMemo, useRef, useState } from "react";
import { Tag, Form, Button, Input, Select, FormInstance } from "antd";
import { ProjectDetails, TaskStatusEnum } from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "../project/board/util";
import { TaskTagCreateForm } from "./TaskTagCreateForm";
import _ from "lodash";
import { useRerender } from "@dewo/app/util/hooks";
interface TaskFormProps<TFormValues> {
  project: ProjectDetails;
  buttonText: string;
  initialValues?: Partial<TFormValues>;
  onSubmit(task: TFormValues): unknown;
}

export function TaskForm<TFormValues>({
  project,
  buttonText,
  initialValues,
  onSubmit,
}: TaskFormProps<TFormValues>) {
  const formRef = useRef<FormInstance<TFormValues>>(null);
  const tagById = useMemo(
    () => _.keyBy(project.taskTags, "id"),
    [project.taskTags]
  );

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: TFormValues) => {
      try {
        setLoading(true);
        await onSubmit(values);
      } finally {
        setLoading(false);
      }
    },
    [onSubmit]
  );

  const rerender = useRerender();

  return (
    <Form
      ref={formRef}
      initialValues={initialValues}
      onFinish={handleSubmit}
      onFinishFailed={console.error}
    >
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
                onCreated={rerender}
                // onCreated={(tag) => {
                //   formRef.current?.setFieldsValue({
                //     tagIds: [
                //       ...formRef.current?.getFieldValue("tagIds"),
                //       tag.id,
                //     ],
                //   });
                //   rerender();
                // }}
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
      <Form.Item name="projectId" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="id" hidden>
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
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  );
}
