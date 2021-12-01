import React, { useCallback, useMemo, useRef, useState } from "react";
import _ from "lodash";
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
  InputNumber,
  ConfigProvider,
  Empty,
} from "antd";
import {
  CreateTaskInput,
  UpdateTaskInput,
  ProjectDetails,
  TaskRewardTrigger,
  TaskStatusEnum,
  User,
  Task,
} from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { STATUS_LABEL } from "../project/board/util";
import { useCreateTaskTag, useGenerateRandomTaskTagColor } from "./hooks";
import { TaskDeleteButton } from "./TaskDeleteButton";
interface TaskFormProps<TFormValues> {
  mode: "create" | "update";
  task?: Task;
  project: ProjectDetails;
  buttonText: string;
  initialValues?: Partial<TFormValues>;
  assignees?: User[];
  onSubmit(task: TFormValues): unknown;
}

export function TaskForm<
  TFormValues extends CreateTaskInput | UpdateTaskInput
>({
  mode,
  task,
  project,
  assignees,
  buttonText,
  initialValues,
  onSubmit,
}: TaskFormProps<TFormValues>) {
  const formRef = useRef<FormInstance<TFormValues>>(null);
  const [values, setValues] = useState<Partial<TFormValues>>(
    initialValues ?? {}
  );
  const tagById = useMemo(
    () => _.keyBy(project.taskTags, "id"),
    [project.taskTags]
  );

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: TFormValues) => {
      try {
        setLoading(true);
        console.warn(values);
        await onSubmit({
          ...values,
          reward: !!values.reward?.amount ? values.reward : undefined,
        });
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

  const handleChange = useCallback(
    (_changed: Partial<TFormValues>, values: Partial<TFormValues>) => {
      setValues(values);
    },
    []
  );

  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={{ reward: { currency: "ETH" }, ...initialValues }}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
    >
      <Row gutter={16}>
        <Col span={16}>
          <Form.Item
            name="name"
            label="Task name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item name="description" label="Description (optional)">
            <Input.TextArea style={{ minHeight: 120 }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={["reward", "amount"]} label="Bounty">
                <InputNumber
                  placeholder="Enter amount"
                  value={values.reward?.amount}
                  addonAfter={
                    <Form.Item name={["reward", "currency"]} noStyle>
                      <Select defaultValue="ETH">
                        <Select.Option value="ETH">ETH</Select.Option>
                        <Select.Option value="USDC">USDC</Select.Option>
                      </Select>
                    </Form.Item>
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["reward", "trigger"]}
                label="Payout trigger"
                rules={[
                  {
                    required: !!values.reward?.amount,
                    message: "Please enter a payout trigger",
                  },
                ]}
                hidden={!values.reward?.amount}
              >
                <Select
                  loading={tagLoading}
                  optionFilterProp="label"
                  placeholder="Select payout trigger"
                >
                  {[
                    {
                      label: "Core team approval",
                      value: TaskRewardTrigger.CORE_TEAM_APPROVAL,
                      icon: Icons.TeamOutlined,
                    },
                    {
                      label: "PR merged",
                      value: TaskRewardTrigger.PULL_REQUEST_MERGED,
                      icon: Icons.GithubOutlined,
                    },
                  ].map((tag) => (
                    <Select.Option value={tag.value} label={tag.label}>
                      <Space style={{ alignItems: "center" }}>
                        <tag.icon />
                        {tag.label}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
                  Contributor Claim Requests
                </Typography.Text>
                <Col>
                  {assignees.map((user) => (
                    <Space style={{ width: "100%", display: "flex" }}>
                      <Avatar
                        src={user.imageUrl}
                        icon={<Icons.TeamOutlined />}
                      />
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

          <Form.Item style={{ marginBottom: 0 }}>
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
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Select a task status">
              {(Object.keys(STATUS_LABEL) as TaskStatusEnum[]).map((status) => (
                <Select.Option key={status} value={status}>
                  {STATUS_LABEL[status]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <ConfigProvider
            renderEmpty={() => (
              <Empty description="Create your first tag by typing..." />
            )}
          >
            <Form.Item name="tagIds" label="Tags" rules={[{ type: "array" }]}>
              <Select
                mode="tags"
                loading={tagLoading}
                optionFilterProp="label"
                placeholder="Select tags..."
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
          </ConfigProvider>

          {mode === "update" && !!task && (
            <>
              <Row>
                <Typography.Text>Actions</Typography.Text>
              </Row>
              <TaskDeleteButton task={task} />
            </>
          )}
        </Col>
      </Row>
    </Form>
  );
}
