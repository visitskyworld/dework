import React, { FC, useCallback, useMemo, useState } from "react";
import { Form, Button, Input, Select, Row, Typography, Col } from "antd";
import { TaskStatusEnum, User, TaskDetails } from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "../project/board/util";
import { useTaskFormUserOptions } from "./hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { AssignTaskCard } from "./AssignTaskCard";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import {
  TaskRewardFormFields,
  TaskRewardFormValues,
  validator as validateTaskReward,
} from "./TaskRewardFormFields";
import { UserSelectOption } from "./UserSelectOption";
import { FormSection } from "@dewo/app/components/FormSection";
import { GithubIntegrationSection } from "./github/GithubIntegrationSection";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { TaskRewardSummary } from "./TaskRewardSummary";
import { TaskTagSelectField } from "./TaskTagSelectField";
import { useForm } from "antd/lib/form/Form";

export interface TaskFormValues {
  name: string;
  description: string;
  projectId?: string;
  status: TaskStatusEnum;
  tagIds: string[];
  assigneeIds: string[];
  ownerId?: string;
  reward?: TaskRewardFormValues;
}

interface TaskFormProps {
  mode: "create" | "update";
  projectId: string;
  task?: TaskDetails;
  buttonText: string;
  initialValues?: Partial<TaskFormValues>;
  assignees?: User[];
  onSubmit(values: TaskFormValues): unknown;
}

export const TaskForm: FC<TaskFormProps> = ({
  mode,
  task,
  projectId,
  buttonText,
  initialValues,
  onSubmit,
}) => {
  const [form] = useForm();
  const [values, setValues] = useState<Partial<TaskFormValues>>(
    initialValues ?? {}
  );
  const canEdit = usePermission(mode, !!task ? task : "Task");
  // const canDelete = usePermission("delete", !!task ? task : "Task");

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
    async (values: TaskFormValues) => {
      try {
        setLoading(true);
        await onSubmit(values);
        form.resetFields();
      } finally {
        setLoading(false);
      }
    },
    [onSubmit, form]
  );

  const handleChange = useCallback(
    (_changed: Partial<TaskFormValues>, values: Partial<TaskFormValues>) => {
      setValues(values);
    },
    []
  );

  const handleBlur = useCallback(() => {
    if (mode === "update") form.submit();
  }, [mode, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      requiredMark={false}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
      onBlur={handleBlur}
    >
      <Row gutter={16}>
        <Col span={24}>
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
        </Col>
      </Row>
      <Row gutter={16} className="dewo-task-form">
        <Col xs={24} sm={16}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
            className="show-xs"
          >
            <Select placeholder="Select a task status" disabled={!canEdit}>
              {(Object.keys(STATUS_LABEL) as TaskStatusEnum[]).map((status) => (
                <Select.Option key={status} value={status}>
                  {STATUS_LABEL[status]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label={canEdit ? `Description (optional)` : "Description"}
          >
            <MarkdownEditor
              initialValue={initialValues?.description ?? undefined}
              editable={canEdit}
              mode={mode}
              onSave={handleBlur}
            />
          </Form.Item>

          {mode === "create" && canEdit && (
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
          {/* {mode === "update" && <Divider />} */}

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
                <Typography.Text
                  strong
                  ellipsis
                  style={{ marginLeft: 4, maxWidth: 200 }}
                >
                  #{task.discordChannel.name}
                </Typography.Text>
              </Button>
            </FormSection>
          )}

          {!!canEdit &&
            !!task &&
            task.status === TaskStatusEnum.TODO &&
            !!task.applications.length && <AssignTaskCard task={task} />}

          {!!task && <GithubIntegrationSection task={task} />}
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
            className="show-sm"
          >
            <Select placeholder="Select a task status" disabled={!canEdit}>
              {(Object.keys(STATUS_LABEL) as TaskStatusEnum[]).map((status) => (
                <Select.Option key={status} value={status}>
                  {STATUS_LABEL[status]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <TaskTagSelectField disabled={!canEdit} projectId={projectId} />

          <Form.Item
            name="assigneeIds"
            label={"Assignees"}
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

          {canEdit &&
          !!projectId &&
          (!task?.reward?.payment || mode === "create") ? (
            <Form.Item
              name="reward"
              label="Task Reward"
              rules={[
                { validator: validateTaskReward, validateTrigger: "onSubmit" },
              ]}
            >
              <TaskRewardFormFields
                projectId={projectId}
                value={values?.reward ?? undefined}
              />
            </Form.Item>
          ) : (
            !!task?.reward && <TaskRewardSummary reward={task.reward} />
          )}

          {/* {canDelete && mode === "update" && !!task && (
            <FormSection label="Actions">
              <TaskDeleteButton task={task} />
            </FormSection>
          )} */}
        </Col>
      </Row>
    </Form>
  );
};
