import React, { FC, useCallback, useMemo, useState } from "react";
import {
  TaskStatus,
  User,
  TaskDetails,
  TaskOptionsInput,
} from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import {
  Form,
  Button,
  Input,
  Select,
  Row,
  Typography,
  Col,
  Checkbox,
  Tooltip,
  DatePicker,
  Divider,
} from "antd";
import { STATUS_LABEL } from "../board/util";
import { useTaskFormUserOptions } from "../hooks";
import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import { AssignTaskCard } from "../AssignTaskCard";
import {
  TaskRewardFormFields,
  TaskRewardFormValues,
  validator as validateTaskReward,
} from "./TaskRewardFormFields";
import { FormSection } from "@dewo/app/components/FormSection";
import { GithubIntegrationSection } from "../github/GithubIntegrationSection";
import { MarkdownEditor } from "@dewo/app/components/markdownEditor/MarkdownEditor";
import { TaskRewardSummary } from "./TaskRewardSummary";
import { TaskTagSelectField } from "./TaskTagSelectField";
import { useForm } from "antd/lib/form/Form";
import { TaskActivityFeed } from "./TaskActivityFeed";
import _ from "lodash";
import { SubtaskInput } from "./SubtaskInput";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { TaskListRow } from "../list/TaskList";
import { AdvancedSectionCollapse } from "@dewo/app/components/AdvancedSectionCollapse";
import { TaskSubmissionsSection } from "./TaskSubmissionsSection";
import { TaskDiscordButton } from "./TaskDiscordButton";
import { StoryPointsInput } from "./StoryPointsInput";
import Link from "next/link";
import { ProjectAvatar } from "@dewo/app/components/ProjectAvatar";
import { UserSelect } from "@dewo/app/components/form/UserSelect";
import { useProjectTaskTags } from "../../project/hooks";
import { TaskTwitterShareButton } from "./TaskTwitterShareButton";

export interface TaskFormValues {
  name: string;
  description?: string;
  projectId?: string;
  parentTaskId?: string;
  status: TaskStatus;
  dueDate?: moment.Moment;
  storyPoints?: number;
  tagIds?: string[];
  assigneeIds: string[];
  ownerId?: string | null;
  reward?: TaskRewardFormValues;
  subtasks?: TaskListRow[];
  options?: TaskOptionsInput;
}

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
  const [form] = useForm<TaskFormValues>();
  const [values, setValues] = useState<Partial<TaskFormValues>>(
    initialValues ?? {}
  );
  const canSubmit = usePermission(mode, !!task ? task : "Task");
  const canCreateTag = usePermission("create", "TaskTag");
  const canCreateReward = usePermission("create", "TaskReward");
  const hasPermission = usePermissionFn();
  const canChange = useCallback(
    (field: keyof TaskFormValues | `status[${TaskStatus}]`) =>
      hasPermission(mode, task ?? "Task", field),
    [hasPermission, mode, task]
  );
  const navigateToTask = useNavigateToTaskFn();

  const ownerOptions = useTaskFormUserOptions(
    projectId,
    useMemo(() => (!!task?.owner ? [task.owner] : []), [task?.owner])
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
      <Row gutter={16} className="dewo-task-form">
        <Col xs={24} sm={16}>
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
            // label={mode === "create" ? "Task name" : undefined}
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input.TextArea
              disabled={!canChange("name")}
              autoSize
              autoFocus={mode === "create"}
              className="dewo-field dewo-field-focus-border ant-typography-h3"
              placeholder="Enter a task name..."
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
          <Form.Item name="description" label="Description" className="mb-3">
            <MarkdownEditor
              initialValue={initialValues?.description ?? undefined}
              editable={canChange("description")}
              mode={mode}
            />
          </Form.Item>

          {(canChange("subtasks") || !!task?.subtasks.length) && (
            <Form.Item
              name="subtasks"
              label="Subtasks"
              style={{ marginBottom: 16 }}
            >
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

          {!!task && <TaskDiscordButton task={task} />}

          {canChange("assigneeIds") &&
            !!task &&
            task.status === TaskStatus.TODO &&
            !!task.applications.length && <AssignTaskCard task={task} />}

          {!!task && <GithubIntegrationSection task={task} />}
          {!!task && <TaskSubmissionsSection task={task} />}
          <Divider />
          {!!task && <TaskActivityFeed task={task} />}
          {!!task && <TaskTwitterShareButton task={task} />}
        </Col>
        <Col xs={24} sm={8} style={{ marginTop: 16 }}>
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
          <Form.Item name="ownerId" label="Reviewer">
            <UserSelect
              placeholder="No task reviewer..."
              disabled={!canChange("ownerId")}
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
            <Form.Item name="storyPoints" label="Task Points">
              <StoryPointsInput disabled={!canChange("storyPoints")} />
            </Form.Item>
          )}

          {canCreateReward &&
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

          {!!task && showProjectLink && (
            <FormSection label="Project">
              <Link href={task.project.permalink}>
                <a style={{ display: "flex" }}>
                  <Button
                    type="text"
                    size="small"
                    className="dewo-btn-highlight"
                    icon={
                      <ProjectAvatar
                        size="small"
                        style={{ flexShrink: 0 }}
                        project={task.project}
                      />
                    }
                  >
                    <Typography.Text
                      style={{
                        marginLeft: 8,
                        width: "100%",
                        textAlign: "left",
                      }}
                      ellipsis
                    >
                      {task.project.name}
                    </Typography.Text>
                  </Button>
                </a>
              </Link>
            </FormSection>
          )}

          {canChange("options") && (
            <AdvancedSectionCollapse>
              <Form.Item
                name={["options", "allowOpenSubmission"]}
                valuePropName="checked"
              >
                <Checkbox>
                  This is a Multiple Submissions bounty{"  "}
                  <Tooltip title="Allow anyone to submit a task submission. Submissions will be shown to admins in the task details. From there, review and pick the best submission.">
                    <Icons.QuestionCircleOutlined />
                  </Tooltip>
                </Checkbox>
              </Form.Item>
            </AdvancedSectionCollapse>
          )}
        </Col>
      </Row>
    </Form>
  );
};
