import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Tag,
  Form,
  Button,
  Input,
  Select,
  FormInstance,
  Avatar,
  Row,
  Typography,
  Space,
  Col,
} from "antd";
import { ProjectDetails, TaskStatusEnum, User } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { STATUS_LABEL } from "../project/board/util";
import _ from "lodash";
import { useCreateTaskTag, useGenerateRandomTaskTagColor } from "./hooks";
interface TaskFormProps<TFormValues> {
  project: ProjectDetails;
  buttonText: string;
  initialValues?: Partial<TFormValues>;
  assignees?: User[];
  onSubmit(task: TFormValues): unknown;
}

export function TaskForm<TFormValues>({
  project,
  assignees,
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

  const [tagLoading, setTagLoading] = useState(false);
  const createTaskTag = useCreateTaskTag();
  const generateRandomTaskTagColor = useGenerateRandomTaskTagColor(
    project.taskTags
  );
  const handleTagsUpdated = useCallback(
    async (labels: string[]) => {
      const [existingTagIds, newTagLabels] = _.partition(
        labels,
        (existingIdOrNewLabel) => !!tagById[existingIdOrNewLabel]
      );

      if (tagLoading && !!newTagLabels.length) {
        // @ts-ignore
        formRef.current?.setFieldsValue({ tagIds: existingTagIds });
        return;
      }

      try {
        setTagLoading(true);
        const tagPs = newTagLabels.map((label) =>
          createTaskTag({
            label,
            projectId: project.id,
            color: generateRandomTaskTagColor(),
          })
        );
        const tags = await Promise.all(tagPs);
        // @ts-ignore
        formRef.current?.setFieldsValue({
          tagIds: [...existingTagIds, ...tags.map((t) => t.id)],
        });
      } finally {
        setTagLoading(false);
      }
    },
    [createTaskTag, tagLoading, tagById, generateRandomTaskTagColor, project.id]
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
      <Form.Item name="tagIds" label="Tags" rules={[{ type: "array" }]}>
        <Select
          mode="tags"
          loading={tagLoading}
          optionFilterProp="label"
          placeholder="Please select favourite colors"
          onChange={handleTagsUpdated}
          optionLabelProp="label" // don't put children inside tagRender
          tagRender={(props) => (
            <Tag
              {...props}
              color={tagById[props.value as string]?.color}
              children={props.label}
            />
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

      {/* TODO: remove this hack and add proper UI */}
      {!!assignees &&
        assignees.length > 0 &&
        (initialValues as any)?.status === TaskStatusEnum.TODO && (
          <Space
            direction="vertical"
            style={{ width: "100%", paddingBottom: 24 }}
          >
            <Typography.Text strong>
              Contributor Reservation Requests
            </Typography.Text>
            <Col>
              {assignees.map((user) => (
                <Space style={{ width: "100%", display: "flex" }}>
                  <Avatar src={user.imageUrl} icon={<Icons.TeamOutlined />} />
                  <Row style={{ width: 120 }}>{user.username}</Row>
                  <Button
                    size="small"
                    onClick={() => {
                      // @ts-ignore
                      formRef.current?.setFieldsValue({
                        assigneeIds: [user.id],
                        status: TaskStatusEnum.IN_PROGRESS,
                      });
                      formRef.current?.submit();
                    }}
                  >
                    Assign
                  </Button>
                </Space>
              ))}
            </Col>
          </Space>
        )}

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
