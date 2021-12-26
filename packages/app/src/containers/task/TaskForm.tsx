import React, { FC, useCallback, useMemo, useState } from "react";
import { Form, Button, Input, Select, Row, Typography, Col } from "antd";
import { TaskStatusEnum, User, TaskDetails } from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "../project/board/util";
import { useTaskFormUserOptions } from "./hooks";
import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
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
import { TaskNumberAndSettings } from "./TaskNumberAndSettings";
import { TaskActivityFeed } from "./TaskActivityFeed";

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
  const canSubmit = usePermission(mode, !!task ? task : "Task");
  const hasPermission = usePermissionFn();
  const canChange = useCallback(
    (field: keyof TaskFormValues | `status[${TaskStatusEnum}]`) =>
      hasPermission(mode, task ?? "Task", field),
    [hasPermission, mode, task]
  );

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
        if (mode === "create") {
          form.resetFields();
        }
      } finally {
        setLoading(false);
      }
    },
    [onSubmit, form, mode]
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
              disabled={!canChange("name")}
              autoSize
              autoFocus={mode === "create"}
              className="dewo-field dewo-field-display ant-typography-h3"
              placeholder="Enter a task name..."
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
            <Select
              placeholder="Select a task status"
              disabled={!canChange("status")}
            >
              {(Object.keys(STATUS_LABEL) as TaskStatusEnum[]).map((status) => (
                <Select.Option
                  key={status}
                  value={status}
                  disabled={!canChange(`status[${status}]`)}
                >
                  {STATUS_LABEL[status]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" className="mb-3">
            <MarkdownEditor
              initialValue={initialValues?.description ?? undefined}
              editable={canChange("description")}
              mode={mode}
              onSave={handleBlur}
            />
          </Form.Item>

          {mode === "create" && canSubmit && (
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

          {!!task?.discordChannel && (
            <FormSection label="Discord" className="mb-3">
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

          {!!canChange("assigneeIds") &&
            !!task &&
            task.status === TaskStatusEnum.TODO &&
            !!task.applications.length && <AssignTaskCard task={task} />}

          {!!task && <GithubIntegrationSection task={task} />}
          {!!task && <TaskActivityFeed task={task} />}
        </Col>
        <Col xs={24} sm={8}>
          {!!task && <TaskNumberAndSettings task={task} />}

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
            className="show-sm"
          >
            <Select
              placeholder="Select a task status"
              disabled={!canChange("status")}
            >
              {(Object.keys(STATUS_LABEL) as TaskStatusEnum[]).map((status) => (
                <Select.Option
                  key={status}
                  value={status}
                  disabled={!canChange(`status[${status}]`)}
                >
                  {STATUS_LABEL[status]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <TaskTagSelectField
            disabled={!canChange("tagIds")}
            projectId={projectId}
          />

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
              disabled={!canChange("assigneeIds")}
              allowClear
              optionFilterProp="label"
              optionLabelProp="label" // don't put children inside tagRender
              placeholder="No task assignee..."
              tagRender={(props) => {
                const user = assigneeOptions?.find((u) => u.id === props.value);
                if (!user) return <div />;
                return (
                  <UserSelectOption user={user} style={{ paddingRight: 12 }} />
                );
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
              disabled={!canChange("ownerId")}
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

          {canChange("reward") &&
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
        </Col>
      </Row>
    </Form>
  );
};
