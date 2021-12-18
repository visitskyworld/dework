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
  Col,
  ConfigProvider,
  Empty,
  Divider,
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
import { STATUS_LABEL } from "../project/board/util";
import {
  useCreateTaskTag,
  useGenerateRandomTaskTagColor,
  useTaskFormUserOptions,
} from "./hooks";
import { TaskDeleteButton } from "./TaskDeleteButton";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { AssignTaskCard } from "./AssignTaskCard";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import {
  rewardTriggerToString,
  TaskRewardFormFields,
} from "./TaskRewardFormFields";
import { UserSelectOption } from "./UserSelectOption";

import { FormSection } from "@dewo/app/components/FormSection";
import { GithubIntegrationSection } from "./github/GithubIntegrationSection";

interface TaskFormProps<TFormValues> {
  mode: "create" | "update";
  task?: Task;
  tags: TaskTag[];
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
  const ownerOptions = useTaskFormUserOptions(
    projectId,
    useMemo(() => (!!task?.owner ? [task.owner] : []), [task?.owner])
  );
  const assigneeOptions = useTaskFormUserOptions(
    projectId,
    useMemo(() => task?.assignees ?? [], [task?.assignees])
  );

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
          <Divider />

          {!!task && <GithubIntegrationSection task={task} />}

          {!!task?.discordChannel && (
            <FormSection label="Discord">
              <Button
                type="primary"
                href={task.discordChannel.link}
                target="_blank"
                icon={<DiscordIcon />}
                size="small"
              >
                Join discussion in
                <Typography.Text strong style={{ marginLeft: 4 }}>
                  #{task.discordChannel.name}
                </Typography.Text>
              </Button>
            </FormSection>
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
                optionLabelProp="label" // don't put children inside tagRender
                placeholder={canEdit ? "Select tags..." : "No tags..."}
                onChange={handleTagsUpdated}
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

          <Form.Item
            name="assigneeIds"
            label={
              values.status === TaskStatusEnum.TODO ? "Applicants" : "Assignees"
            }
            rules={[{ type: "array" }]}
          >
            <Select
              mode="multiple"
              showSearch
              className="dewo-select-item-full-width"
              loading={!assigneeOptions}
              disabled={!canEdit}
              allowClear
              optionFilterProp="label"
              optionLabelProp="label" // don't put children inside tagRender
              placeholder="No task assignee..."
              tagRender={(props) => {
                const user = assigneeOptions?.find((u) => u.id === props.value);
                if (!user) return <div />;
                return <UserSelectOption user={user} style={{ padding: 4 }} />;
              }}
            >
              {assigneeOptions?.map((user) => (
                <Select.Option value={user.id} label={user.username}>
                  <UserSelectOption user={user} />
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="ownerId" label="Reviewer">
            <Select
              showSearch
              loading={!ownerOptions}
              disabled={!canEdit}
              allowClear
              optionFilterProp="label"
              placeholder="No task reviewer..."
            >
              {ownerOptions?.map((user) => (
                <Select.Option value={user.id} label={user.username}>
                  <UserSelectOption user={user} />
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {canEdit ? (
            <TaskRewardFormFields value={values?.reward ?? undefined} />
          ) : (
            !!values.reward && (
              <FormSection label="Reward">
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
              </FormSection>
            )
          )}

          {canDelete && mode === "update" && !!task && (
            <FormSection label="Actions">
              <TaskDeleteButton task={task} />
            </FormSection>
          )}
        </Col>
      </Row>
      <Form.Item name="projectId" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
    </Form>
  );
}
