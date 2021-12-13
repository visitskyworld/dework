import React, { useCallback, useMemo, useRef, useState } from "react";
import _ from "lodash";
import {
  Tag,
  Form,
  Button,
  Input,
  Select,
  FormInstance,
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
  TaskRewardTrigger,
  TaskStatusEnum,
  User,
  Task,
  TaskTag,
} from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { STATUS_LABEL } from "../project/board/util";
import { useCreateTaskTag, useGenerateRandomTaskTagColor } from "./hooks";
import { TaskDeleteButton } from "./TaskDeleteButton";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { AssignTaskCard } from "./AssignTaskCard";

interface TaskFormProps<TFormValues> {
  mode: "create" | "update";
  task?: Task;
  tags: TaskTag[];
  buttonText: string;
  initialValues?: Partial<TFormValues>;
  assignees?: User[];
  onSubmit(task: TFormValues): unknown;
}

const rewardTriggerToString: Record<TaskRewardTrigger, string> = {
  [TaskRewardTrigger.CORE_TEAM_APPROVAL]: "Core team approval",
  [TaskRewardTrigger.PULL_REQUEST_MERGED]: "PR merged",
};

export function TaskForm<
  TFormValues extends CreateTaskInput | UpdateTaskInput
>({
  mode,
  task,
  tags,
  buttonText,
  initialValues,
  onSubmit,
}: TaskFormProps<TFormValues>) {
  const formRef = useRef<FormInstance<TFormValues>>(null);
  const [values, setValues] = useState<Partial<TFormValues>>(
    initialValues ?? {}
  );
  const tagById = useMemo(() => _.keyBy(tags, "id"), [tags]);

  const canEdit = usePermission(mode, "Task");
  const canDelete = usePermission("delete", "Task");

  const projectId: string =
    task?.projectId ?? (initialValues as any)?.projectId!;

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: TFormValues) => {
      try {
        setLoading(true);
        await onSubmit({
          ...values,
          reward: !!values.reward?.amount
            ? {
                amount: values.reward.amount,
                currency: values.reward.currency,
                trigger: values.reward.trigger,
              }
            : undefined,
        });
        formRef.current?.resetFields();
      } finally {
        setLoading(false);
      }
    },
    [onSubmit]
  );

  const [tagLoading, setTagLoading] = useState(false);
  const createTaskTag = useCreateTaskTag();
  const generateRandomTaskTagColor = useGenerateRandomTaskTagColor(tags);
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
            projectId,
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
    [createTaskTag, tagLoading, tagById, generateRandomTaskTagColor, projectId]
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
      requiredMark={false}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
    >
      <Row gutter={16}>
        <Col span={16}>
          <Form.Item
            name="name"
            // label={mode === "create" ? "Task name" : undefined}
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input.TextArea
              disabled={!canEdit}
              autoSize
              autoFocus={mode === "create"}
              className="dewo-field dewo-field-display ant-typography-h3"
              placeholder={canEdit ? `Enter a task name...` : "Untitled..."}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={canEdit ? `Description (optional)` : "Description"}
          >
            <Input.TextArea
              disabled={!canEdit}
              autoSize
              className="dewo-field"
              placeholder={
                canEdit ? "Enter a description..." : "No description"
              }
              style={{ minHeight: 120 }}
            />
          </Form.Item>

          <Form.Item name="projectId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          {canEdit && (
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
          )}
        </Col>
        <Col span={8} style={{ marginTop: 62 }}>
          {!!canEdit &&
            !!task &&
            task.status === TaskStatusEnum.TODO &&
            !!task.assignees.length && <AssignTaskCard task={task} />}

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Select a task status" disabled={!canEdit}>
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
                disabled={!canEdit}
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
                {tags.map((tag) => (
                  <Select.Option value={tag.id} label={tag.label}>
                    <Tag color={tag.color}>{tag.label}</Tag>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ConfigProvider>

          {canEdit ? (
            <>
              <Form.Item name={["reward", "amount"]} label="Bounty">
                <InputNumber
                  placeholder="Enter amount"
                  value={values.reward?.amount}
                  addonAfter={
                    <Form.Item
                      name={["reward", "currency"]}
                      noStyle
                      rules={[
                        {
                          required: !!values.reward?.amount,
                          message: "Select a currency",
                        },
                      ]}
                    >
                      <Select style={{ minWidth: 70 }} placeholder="Currency">
                        <Select.Option value="ETH">ETH</Select.Option>
                        <Select.Option value="USDC">USDC</Select.Option>
                      </Select>
                    </Form.Item>
                  }
                />
              </Form.Item>
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
                      label:
                        rewardTriggerToString[
                          TaskRewardTrigger.CORE_TEAM_APPROVAL
                        ],
                      value: TaskRewardTrigger.CORE_TEAM_APPROVAL,
                      icon: Icons.TeamOutlined,
                    },
                    {
                      label:
                        rewardTriggerToString[
                          TaskRewardTrigger.PULL_REQUEST_MERGED
                        ],
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
            </>
          ) : (
            !!values.reward && (
              <Row className="ant-form-item">
                <Row>
                  <Typography.Text className="ant-form-item-label">
                    Reward
                  </Typography.Text>
                </Row>
                <Row>
                  <Typography.Text>
                    {values.reward.amount} {values.reward.currency} (
                    {
                      rewardTriggerToString[
                        TaskRewardTrigger.CORE_TEAM_APPROVAL
                      ]
                    }
                    )
                  </Typography.Text>
                </Row>
              </Row>
            )
          )}

          {canDelete && mode === "update" && !!task && (
            <>
              <Row>
                <Typography.Text className="ant-form-item-label">
                  Actions
                </Typography.Text>
              </Row>
              <TaskDeleteButton task={task} />
            </>
          )}
        </Col>
      </Row>
    </Form>
  );
}
