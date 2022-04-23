import React, { FC, useCallback, useMemo, useState } from "react";
import {
  TaskStatus,
  User,
  TaskDetails,
  TaskPriority,
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
  DatePicker,
  Divider,
  Space,
  Breadcrumb,
} from "antd";
import {
  getProjectTaskStatuses,
  PRIORITY_LABEL,
  STATUS_LABEL,
} from "../board/util";
import { useTaskFormUserOptions } from "../hooks";
import {
  usePermission,
  usePermissionFn,
} from "@dewo/app/contexts/PermissionsContext";
import { TaskApplicationList } from "../TaskApplicationList";
import { GithubIntegrationSection } from "../github/GithubIntegrationSection";
import { TaskTagSelectField } from "./TaskTagSelectField";
import { useForm } from "antd/lib/form/Form";
import _ from "lodash";
import { SubtaskInput } from "./subtask/SubtaskInput";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { TaskSubmissionsSection } from "./TaskSubmissionsSection";
import { TaskDiscordButton } from "./TaskDiscordButton";
import { StoryPointsInput } from "./StoryPointsInput";
import { UserSelect } from "@dewo/app/components/form/UserSelect";
import { useProjectDetails, useProjectTaskTags } from "../../project/hooks";
import { TaskTwitterShareButton } from "./TaskTwitterShareButton";
import { TaskActionSection } from "../actions/TaskActionSection";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { TaskGithubBranchButton } from "../github/TaskGithubBranchButton";
import {
  TaskRewardSection,
  useCanUpdateTaskReward,
} from "./reward/TaskRewardSection";
import { TaskGatingFields } from "./gating/TaskGatingFields";
import { TaskFormValues } from "./types";
import { MoreSectionCollapse } from "@dewo/app/components/MoreSectionCollapse";
import { RichMarkdownEditor } from "@dewo/app/components/richMarkdownEditor/RichMarkdownEditor";
import { TaskActivityFeed } from "./TaskActivityFeed";
import { useToggle } from "@dewo/app/util/hooks";
import { TaskPriorityIcon } from "../board/TaskPriorityIcon";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";

interface TaskFormProps {
  mode: "create" | "update";
  projectId: string;
  task?: TaskDetails;
  buttonText?: string;
  initialValues?: Partial<TaskFormValues>;
  assignees?: User[];
  showProjectLink?: boolean;
  onSubmit(values: TaskFormValues): unknown;
  onChange?(values: Partial<TaskFormValues>): unknown;
}

export const TaskForm: FC<TaskFormProps> = ({
  mode,
  task,
  projectId,
  buttonText,
  initialValues,
  showProjectLink,
  onChange,
  onSubmit,
}) => {
  const screens = useBreakpoint();
  const { project } = useProjectDetails(projectId);

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

  const tags = useProjectTaskTags(projectId);

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: TaskFormValues) => {
      try {
        setLoading(true);
        await onSubmit(values);
      } finally {
        setLoading(false);
      }
    },
    [onSubmit]
  );

  const debouncedSubmit = useMemo(
    () => _.debounce(handleSubmit, 500),
    [handleSubmit]
  );

  const handleChange = useCallback(
    (changed: Partial<TaskFormValues>, values: Partial<TaskFormValues>) => {
      form.setFieldsValue(values);
      setValues(values);
      onChange?.(values);

      if (mode === "update") {
        debouncedSubmit(changed as TaskFormValues);
      }
    },
    [form, mode, debouncedSubmit, onChange]
  );

  const showTaskRewardFirst = !useCanUpdateTaskReward(task);
  const moreSection = useToggle(!!values?.dueDate || !!values?.storyPoints);

  return (
    <Form
      form={form}
      name={`Task Form (${mode})`}
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
              style={{ marginLeft: -8, alignSelf: "flex-start" }}
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

          {showProjectLink && !!task && (
            <Breadcrumb>
              <Breadcrumb.Item href={task.project.organization.permalink}>
                <OrganizationAvatar
                  size={16}
                  tooltip={{ visible: false }}
                  organization={task.project.organization}
                  style={{ marginRight: 8 }}
                />
                <span>{task.project.organization.name}</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href={task.project.permalink}
                className="text-secondary"
                // style={{ color: "unset" }}
              >
                {task.project.name}
              </Breadcrumb.Item>
            </Breadcrumb>
          )}

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input.TextArea
              disabled={!canChange("name")}
              autoSize
              autoFocus={mode === "create"}
              className="dewo-field dewo-field-focus-border ant-typography-h3 overflow-y-hidden"
              placeholder="Enter a task name..."
              style={{ paddingLeft: 4 }}
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
              {getProjectTaskStatuses(project).map((status) => (
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

          <Form.Item name="description">
            <RichMarkdownEditor
              initialValue={initialValues?.description ?? ""}
              mode={mode}
              editable={!!canChange("description")}
            />
          </Form.Item>

          {(canChange("subtasks") || !!task?.subtasks.length) && (
            <Form.Item name="subtasks" style={{ marginBottom: 16 }}>
              <SubtaskInput projectId={projectId} task={task} />
            </Form.Item>
          )}

          {mode === "create" && canSubmit && (
            <>
              <div style={{ flex: 1 }} />
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                {buttonText}
              </Button>
            </>
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
                <TaskGithubBranchButton task={task} />
                <TaskTwitterShareButton task={task} />
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
              {getProjectTaskStatuses(project).map((status) => (
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

          <TaskGatingFields
            mode={mode}
            task={task}
            values={values}
            projectId={projectId}
            disabled={!canChange("ownerIds")}
          />

          <Form.Item name="priority" label="Priority">
            <Select
              placeholder="Select a priority"
              disabled={!canChange("priority")}
            >
              {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map(
                (priority) => (
                  <Select.Option key={priority} value={priority}>
                    <Space align="center">
                      <div style={{ lineHeight: 1 }}>
                        <TaskPriorityIcon priority={priority} />
                      </div>
                      {PRIORITY_LABEL[priority]}
                    </Space>
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          <TaskTagSelectField
            name="tagIds"
            label="Tags"
            disabled={!canChange("tagIds")}
            allowCreate={canCreateTag}
            projectId={projectId}
            tags={tags}
          />

          <Form.Item name="ownerIds" label="Reviewers">
            <UserSelect
              placeholder="No task reviewer..."
              disabled={!canChange("ownerIds")}
              mode="multiple"
              users={ownerOptions}
            />
          </Form.Item>

          {!showTaskRewardFirst && (
            <TaskRewardSection
              projectId={projectId}
              task={task}
              value={values?.reward}
            />
          )}

          {!canChange("dueDate") && !!values.dueDate && (
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker format="LL" disabled style={{ width: "100%" }} />
            </Form.Item>
          )}

          {!canChange("storyPoints") && !!values.storyPoints && (
            <Form.Item
              name="storyPoints"
              label="Task Points"
              tooltip="Developers often call this 'storypoints'. Use this to estimate the size of the task in hours. Can be used very flexibly, e.g for time accounting and more."
            >
              <StoryPointsInput disabled />
            </Form.Item>
          )}

          {(canChange("dueDate") || canChange("storyPoints")) && (
            <MoreSectionCollapse label="More" toggle={moreSection}>
              {canChange("dueDate") && (
                <Form.Item name="dueDate" label="Due Date">
                  <DatePicker format="LL" style={{ width: "100%" }} />
                </Form.Item>
              )}

              {canChange("storyPoints") && (
                <Form.Item
                  name="storyPoints"
                  label="Task Points"
                  tooltip="Developers often call this 'storypoints'. Use this to estimate the size of the task in hours. Can be used very flexibly, e.g for time accounting and more."
                >
                  <StoryPointsInput />
                </Form.Item>
              )}
            </MoreSectionCollapse>
          )}
        </Col>
      </Row>
    </Form>
  );
};
