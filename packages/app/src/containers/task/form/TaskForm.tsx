import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  TaskStatus,
  TaskDetails,
  TaskPriority,
  TaskGatingType,
  Task,
} from "@dewo/app/graphql/types";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Divider,
  Space,
  Breadcrumb,
  Tag,
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
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { TaskPriorityIcon } from "@dewo/app/components/icons/task/TaskPriority";
import { TaskStatusIcon } from "@dewo/app/components/icons/task/TaskStatus";
import { TaskGithubIssueButton } from "./TaskGithubIssueButton";
import { SkillSelect } from "@dewo/app/components/form/SkillSelect";
import { TaskFormCreateButton } from "./TaskFormCreateButton";
import { AtLeast } from "@dewo/app/types/general";
import { NumberOutlined } from "@ant-design/icons";

interface TaskFormProps {
  mode: "create" | "update";
  projectId: string;
  task?: TaskDetails;
  initialValues?: Partial<TaskFormValues>;
  showProjectLink?: boolean;
  onSubmit(values: TaskFormValues): unknown;
  onChange?(values: Partial<TaskFormValues>): unknown;
}

export const TaskForm: FC<TaskFormProps> = ({
  mode,
  task,
  projectId,
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
      hasPermission(
        mode,
        task ??
          ({
            __typename: "Task",
            projectId,
            status: values.status,
            ownerIds: values.ownerIds ?? [],
          } as AtLeast<Task, "__typename" | "status">),
        field
      ),
    [hasPermission, mode, task, projectId, values.status, values.ownerIds]
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
      changed.skillIds = changed.skillIds?.slice(0, 2);
      const shouldResetRoles =
        !!changed.gating && changed.gating !== TaskGatingType.ROLES;
      const shouldResetAssignees =
        !!changed.gating &&
        changed.gating !== TaskGatingType.ASSIGNEES &&
        !!values.assigneeIds?.length;

      const newValues: Partial<TaskFormValues> = {
        ...values,
        ...(shouldResetRoles && { roleIds: [] }),
        ...(shouldResetAssignees && { assigneeIds: [] }),
      };
      const newChanged: Partial<TaskFormValues> = {
        ...changed,
        ...(shouldResetRoles && { roleIds: [] }),
        ...(shouldResetAssignees && { assigneeIds: [] }),
      };

      form.setFieldsValue(newValues);
      setValues(newValues);
      onChange?.(newValues);

      if (mode === "update") {
        debouncedSubmit(newChanged as TaskFormValues);
      }
    },
    [form, mode, debouncedSubmit, onChange]
  );

  useEffect(() => {
    if (!!initialValues) {
      setValues({ ...values, ...initialValues });
      form.setFieldsValue(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

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
          {!!task && (
            <Breadcrumb style={{ marginLeft: 4 }}>
              {showProjectLink && (
                <>
                  <Breadcrumb.Item href={task.project.organization.permalink}>
                    <OrganizationAvatar
                      size={16}
                      tooltip={{ visible: false }}
                      organization={task.project.organization}
                      style={{ marginRight: 4 }}
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
                </>
              )}
              {!!task.parentTask && (
                <Breadcrumb.Item
                  href="#"
                  onClick={() => navigateToTask(task.parentTask!.id)}
                >
                  {task.parentTask.name}
                </Breadcrumb.Item>
              )}
              <Breadcrumb.Item className="text-secondary">
                <NumberOutlined style={{ opacity: 0.3 }} />
                {task.number}
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
                  <Row align="middle" style={{ columnGap: 8 }}>
                    <TaskStatusIcon status={status} />
                    {STATUS_LABEL[status]}
                  </Row>
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

          <Form.Item name="subtasks" style={{ marginBottom: 0 }}>
            <SubtaskInput projectId={projectId} task={task} />
          </Form.Item>

          {mode === "create" && canSubmit && (
            <>
              <div style={{ flex: 1 }} />
              <TaskFormCreateButton
                loading={loading}
                showSkillsPrompt={
                  !values.skillIds?.length && !!canChange("skillIds")
                }
                onSubmit={form.submit}
              />
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
                <TaskGithubIssueButton task={task} />
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
                  <Row align="middle" style={{ columnGap: 8 }}>
                    <TaskStatusIcon status={status} />
                    {STATUS_LABEL[status]}
                  </Row>
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
            hidden={!canChange("ownerIds") && !values?.gating}
          />

          <Form.Item
            name="skillIds"
            hidden={!canChange("skillIds") && !values.skillIds?.length}
            rules={[
              { type: "array", max: 2, message: "Select at most 2 skills" },
            ]}
            label={
              <>
                Skills
                <Tag
                  color="green"
                  style={{
                    fontWeight: "normal",
                    textTransform: "none",
                    marginLeft: 4,
                  }}
                >
                  New
                </Tag>
              </>
            }
          >
            <SkillSelect
              disabled={!canChange("skillIds")}
              placeholder="What skills are needed to do this task?"
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            hidden={
              !canChange("priority") && values.priority !== TaskPriority.NONE
            }
          >
            <Select
              placeholder="Select a priority"
              disabled={!canChange("priority")}
            >
              {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map(
                (priority) => (
                  <Select.Option key={priority} value={priority}>
                    <Space align="center">
                      <div style={{ lineHeight: 1 }}>
                        <TaskPriorityIcon priority={priority} size={13} />
                      </div>
                      {PRIORITY_LABEL[priority]}
                    </Space>
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>

          {(canChange("tagIds") || !!values.tagIds?.length) && (
            <TaskTagSelectField
              name="tagIds"
              label="Tags"
              disabled={!canChange("tagIds")}
              allowCreate={canCreateTag}
              projectId={projectId}
              tags={tags}
            />
          )}

          <Form.Item
            name="ownerIds"
            label="Reviewers"
            hidden={!canChange("ownerIds") && !values.ownerIds?.length}
          >
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

          <Form.Item
            name="dueDate"
            label="Due Date"
            hidden={canChange("dueDate") || !values.dueDate}
          >
            <DatePicker format="LL" disabled style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="storyPoints"
            label="Task Points"
            tooltip="Can be used very flexibly, e.g for time accounting and more."
            hidden={canChange("storyPoints") || !values.storyPoints}
          >
            <StoryPointsInput disabled />
          </Form.Item>

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
                  tooltip="Can be used very flexibly, e.g for time accounting and more."
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
