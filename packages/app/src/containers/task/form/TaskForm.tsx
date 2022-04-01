import React, { FC, useCallback, useMemo, useState } from "react";
import { TaskStatus, User, TaskDetails } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import {
  Form,
  Button,
  Input,
  Select,
  Row,
  Typography,
  Col,
  DatePicker,
  Divider,
} from "antd";
import { STATUS_LABEL } from "../board/util";
import { useTaskFormUserOptions } from "../hooks";
import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import { TaskApplicationList } from "../TaskApplicationList";
import { GithubIntegrationSection } from "../github/GithubIntegrationSection";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { TaskTagSelectField } from "./TaskTagSelectField";
import { useForm } from "antd/lib/form/Form";
import { TaskActivityFeed } from "./TaskActivityFeed";
import _ from "lodash";
import { SubtaskInput } from "./SubtaskInput";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { TaskSubmissionsSection } from "./TaskSubmissionsSection";
import { TaskDiscordButton } from "./TaskDiscordButton";
import { StoryPointsInput } from "./StoryPointsInput";
import { UserSelect } from "@dewo/app/components/form/UserSelect";
import { useProjectTaskTags } from "../../project/hooks";
import { TaskTwitterShareButton } from "./TaskTwitterShareButton";
import { TaskActionSection } from "../actions/TaskActionSection";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { TaskGithubBranchButton } from "../github/TaskGithubBranchButton";
import {
  TaskRewardSection,
  useCanUpdateTaskReward,
} from "./reward/TaskRewardSection";
import { TaskProjectRow } from "./TaskProjectRow";
import { TaskGatingFields } from "./gating/TaskGatingFields";
import { TaskFormValues } from "./types";

interface TaskFormProps {
  mode: "create" | "update";
  projectId: string;
  task?: TaskDetails;
  buttonText?: string;
  initialValues?: Partial<TaskFormValues>;
  assignees?: User[];
  showProjectLink?: boolean;
  onSubmit(values: TaskFormValues): unknown;
}

export const TaskForm: FC<TaskFormProps> = ({
  mode,
  task,
  projectId,
  buttonText,
  initialValues,
  showProjectLink,
  onSubmit,
}) => {
  const screens = useBreakpoint();

  const [form] = useForm<TaskFormValues>();
  const [values, setValues] = useState<Partial<TaskFormValues>>(
    initialValues ?? {}
  );
  const canSubmit = usePermission(mode, !!task ? task : "Task");
  const canCreateTag = usePermission("create", {
    __typename: "TaskTag",
    projectId,
  });
  const hasPermission = usePermissionFn();
  const canChange = useCallback(
    (field: keyof TaskFormValues | `status[${TaskStatus}]`) =>
      hasPermission(mode, task ?? "Task", field),
    [hasPermission, mode, task]
  );
  const navigateToTask = useNavigateToTaskFn();

  const ownerOptions = useTaskFormUserOptions(
    projectId,
    useMemo(() => task?.owners ?? [], [task?.owners])
  );
  const assigneeOptions = useTaskFormUserOptions(
    projectId,
    useMemo(() => task?.assignees ?? [], [task?.assignees])
  );

  const tags = useProjectTaskTags(projectId);

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
      form.setFieldsValue(values);
      setValues(values);

      if (mode === "update") {
        debouncedSubmit(changed as TaskFormValues);
      }
    },
    [form, mode, debouncedSubmit]
  );

  const showTaskRewardFirst = !useCanUpdateTaskReward(task);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      requiredMark={false}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
    >
      <Row gutter={[36, 36]} className="dewo-task-form">
        <Col
          xs={24}
          sm={16}
          style={{ display: "flex", flexDirection: "column" }}
          className={!screens.xs ? "dewo-divider-right" : undefined}
        >
          {!!task?.parentTask && (
            <Button
              type="text"
              size="small"
              style={{ marginLeft: -12 }}
              icon={<Icons.CaretLeftFilled className="text-secondary" />}
              onClick={() => navigateToTask(task.parentTask!.id)}
            >
              <Typography.Text
                type="secondary"
                style={{ marginLeft: 8, width: "100%", textAlign: "left" }}
                ellipsis
              >
                {task.parentTask.name}
              </Typography.Text>
            </Button>
          )}

          <Form.Item
            name="name"
            noStyle
            // label={mode === "create" ? "Task name" : undefined}
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input.TextArea
              disabled={!canChange("name")}
              autoSize
              autoFocus={mode === "create"}
              className="dewo-field dewo-field-focus-border ant-typography-h3 overflow-y-hidden"
              placeholder="Enter a task name..."
              style={{ marginLeft: -12, marginRight: -12 }}
            />
          </Form.Item>

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
          <Form.Item name="description" className="mb-3">
            <MarkdownEditor
              initialValue={initialValues?.description ?? undefined}
              editable={canChange("description")}
              placeholder={
                canChange("description") ? undefined : "No task description..."
              }
              mode={mode}
            />
          </Form.Item>

          {(canChange("subtasks") || !!task?.subtasks.length) && (
            <Form.Item name="subtasks" style={{ marginBottom: 16 }}>
              <SubtaskInput projectId={projectId} task={task} />
            </Form.Item>
          )}

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

          {!!task && (
            <>
              {canChange("assigneeIds") &&
                task.status === TaskStatus.TODO &&
                !!task.applications.length && (
                  <TaskApplicationList task={task} />
                )}

              <GithubIntegrationSection task={task} />
              <TaskSubmissionsSection task={task} />

              <div style={{ flex: 1, minHeight: 40 }} />

              <Row style={{ rowGap: 8, columnGap: 8 }}>
                <TaskDiscordButton task={task} />
                <TaskTwitterShareButton task={task} />
                <TaskGithubBranchButton task={task} />
              </Row>
              <Divider style={{ marginTop: 16 }} />
              <TaskActivityFeed task={task} />
            </>
          )}
        </Col>
        <Col xs={24} sm={8} style={{ marginTop: 16 }}>
          {!!task && <TaskActionSection task={task} />}
          {showTaskRewardFirst && (
            <TaskRewardSection
              projectId={projectId}
              task={task}
              value={values?.reward}
            />
          )}

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
            allowCreate={canCreateTag}
            projectId={projectId}
            tags={tags}
          />

          <Form.Item
            name="assigneeIds"
            label="Assignees"
            rules={[{ type: "array" }]}
          >
            <UserSelect
              placeholder="No task assignee..."
              disabled={!canChange("assigneeIds")}
              mode="multiple"
              users={assigneeOptions}
            />
          </Form.Item>
          <Form.Item name="ownerIds" label="Reviewers">
            <UserSelect
              placeholder="No task reviewer..."
              disabled={!canChange("ownerIds")}
              mode="multiple"
              users={ownerOptions}
            />
          </Form.Item>

          {(canChange("dueDate") || !!values.dueDate) && (
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker
                format="LL"
                disabled={!canChange("dueDate")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          )}

          {(canChange("storyPoints") || !!values.storyPoints) && (
            <Form.Item
              name="storyPoints"
              label="Task Points"
              tooltip="Developers often call this 'storypoints'. Use this to estimate the size of the task in hours. Can be used very flexibly, e.g for time accounting and more."
            >
              <StoryPointsInput disabled={!canChange("storyPoints")} />
            </Form.Item>
          )}

          {!showTaskRewardFirst && (
            <TaskRewardSection
              projectId={projectId}
              task={task}
              value={values?.reward}
            />
          )}

          <TaskGatingFields
            gating={values.gating}
            projectId={projectId}
            canSetDefault={mode === "create"}
          />

          {!!task && showProjectLink && (
            <TaskProjectRow project={task.project} />
          )}
        </Col>
      </Row>
    </Form>
  );
};
