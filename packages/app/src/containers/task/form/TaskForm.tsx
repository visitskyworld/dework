import React, { FC, useCallback, useMemo, useState } from "react";
import { TaskStatus, User, TaskDetails } from "@dewo/app/graphql/types";
import {
  Form,
  Button,
  Input,
  Select,
  Row,
  Typography,
  Col,
  Divider,
} from "antd";
import { STATUS_LABEL } from "../board/util";
import { useTaskFormUserOptions } from "../hooks";
import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import { AssignTaskCard } from "../AssignTaskCard";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import {
  TaskRewardFormFields,
  TaskRewardFormValues,
  validator as validateTaskReward,
} from "./TaskRewardFormFields";
import { UserSelectOption } from "./UserSelectOption";
import { FormSection } from "@dewo/app/components/FormSection";
import { GithubIntegrationSection } from "../github/GithubIntegrationSection";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { TaskRewardSummary } from "./TaskRewardSummary";
import { TaskTagSelectField } from "./TaskTagSelectField";
import { useForm } from "antd/lib/form/Form";
import { TaskNumberAndSettings } from "./TaskNumberAndSettings";
import { TaskActivityFeed } from "./TaskActivityFeed";
import { ProjectAvatar } from "@dewo/app/components/ProjectAvatar";
import Link from "next/link";
import _ from "lodash";

export interface TaskFormValues {
  name: string;
  description: string;
  submission: string;
  projectId?: string;
  status: TaskStatus;
  storyPoints?: number;
  tagIds: string[];
  assigneeIds: string[];
  ownerId?: string | null;
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
  const [form] = useForm<TaskFormValues>();
  const [values, setValues] = useState<Partial<TaskFormValues>>(
    initialValues ?? {}
  );
  const canSubmit = usePermission(mode, !!task ? task : "Task");
  const hasPermission = usePermissionFn();
  const canChange = useCallback(
    (field: keyof TaskFormValues | `status[${TaskStatus}]`) =>
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

  const debouncedSubmit = useMemo(
    () => _.debounce(handleSubmit, 500),
    [handleSubmit]
  );

  const handleChange = useCallback(
    (changed: Partial<TaskFormValues>, values: Partial<TaskFormValues>) => {
      if ("ownerId" in changed && changed.ownerId === undefined) {
        values.ownerId = null;
      }
      form.setFieldsValue(values);
      setValues(values);

      if (mode === "update") {
        debouncedSubmit(changed as TaskFormValues);
      }
    },
    [form, mode, debouncedSubmit]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      requiredMark={false}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
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
              {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((status) => (
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
            />
          </Form.Item>

          {mode === "create" && canSubmit && (
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              {buttonText}
            </Button>
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
            task.status === TaskStatus.TODO &&
            !!task.applications.length && <AssignTaskCard task={task} />}

          {!!task && <GithubIntegrationSection task={task} />}
          {!!task && <TaskActivityFeed task={task} />}
          {mode === "update" && !!task && task.status !== TaskStatus.TODO && (
            <>
              <Divider>Submission</Divider>
              <Form.Item
                name="submission"
                label="Completed Work"
                className="mb-3"
              >
                <MarkdownEditor
                  initialValue={initialValues?.submission ?? undefined}
                  placeholder={
                    "No submission yet." +
                    (canChange("submission")
                      ? " Please submit any files to be reviewed and write a short summary of your completed work."
                      : "")
                  }
                  buttonText="Edit submission"
                  editable={canChange("submission")}
                  mode={mode}
                />
              </Form.Item>
            </>
          )}
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
              {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((status) => (
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
            label="Assignees"
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

          <Form.Item name="storyPoints" label="Story Points">
            <Select<number>
              disabled={!canChange("storyPoints")}
              allowClear
              placeholder="Estimate task size..."
            >
              <Select.Option value={1} children="1" />
              <Select.Option value={2} children="2" />
              <Select.Option value={3} children="3" />
              <Select.Option value={5} children="5" />
              <Select.Option value={8} children="8" />
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

          {!!task && (
            <FormSection label="Project">
              <Link href={task.project.permalink}>
                <a>
                  <Row align="middle">
                    <ProjectAvatar size="small" project={task.project} />
                    <Typography.Text style={{ marginLeft: 8 }}>
                      {task.project.name}
                    </Typography.Text>
                  </Row>
                </a>
              </Link>
            </FormSection>
          )}
        </Col>
      </Row>
    </Form>
  );
};