import { Button, Checkbox, Form, Row, Select, Tag } from "antd";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { TaskRoleSelectField } from "./TaskRoleSelectField";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { RulePermission, Task, TaskGatingType } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { UserSelect } from "@dewo/app/components/form/UserSelect";
import { useTaskFormUserOptions } from "../../hooks";
import { TaskFormValues } from "../types";
import { deworkSocialLinks } from "@dewo/app/util/constants";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";
import { ApplicationIcon } from "@dewo/app/components/icons/task/Application";
import { ContestIcon } from "@dewo/app/components/icons/task/Contest";
import { ClaimableIcon } from "@dewo/app/components/icons/task/Claimable";
import {
  useCopyToClipboardAndShowToast,
  useRunning,
} from "@dewo/app/util/hooks";
import { useCreateInvite } from "@dewo/app/containers/invite/hooks";

const labels: Record<TaskGatingType, string> = {
  [TaskGatingType.ASSIGNEES]: "Assign someone",
  [TaskGatingType.APPLICATION]: "Application Process",
  [TaskGatingType.OPEN_SUBMISSION]: "Multiple Submissions",
  [TaskGatingType.ROLES]: "Discord Roles",
};

const icons: Record<TaskGatingType, ReactNode> = {
  [TaskGatingType.ASSIGNEES]: <Icons.UserAddOutlined />,
  [TaskGatingType.APPLICATION]: <ApplicationIcon style={{ width: 16 }} />,
  [TaskGatingType.OPEN_SUBMISSION]: <ContestIcon style={{ width: 16 }} />,
  [TaskGatingType.ROLES]: <ClaimableIcon style={{ width: 16 }} />,
};

const descriptions: Partial<Record<TaskGatingType, string>> = {
  [TaskGatingType.APPLICATION]:
    "Contributors can apply to this task, and the reviewer can assign the best applicant.",
  [TaskGatingType.ROLES]:
    "Contributors with certain roles can assign themselves to this task. Anyone can still apply to claim this task, but the selected roles can claim and start working on this without an application.",
  [TaskGatingType.OPEN_SUBMISSION]:
    "Allow anyone to submit a task submission. Submissions will be shown to admins in the task details. From there, review and pick the best submission.",
};

interface Props {
  mode: "create" | "update";
  task: Task | undefined;
  values: Partial<TaskFormValues> | undefined;
  disabled: boolean;
  hidden: boolean;
  projectId: string;
}

export const TaskGatingFields: FC<Props> = ({
  task,
  mode,
  values,
  projectId,
  disabled,
  hidden,
}) => {
  const canManageRoles = usePermission("create", {
    __typename: "Rule",
    permission: RulePermission.MANAGE_TASKS,
    // @ts-ignore
    __task__: { projectId },
  });

  const canChangeAssignees = usePermission(mode, task ?? "Task", "assigneeIds");
  const assigneeOptions = useTaskFormUserOptions(
    projectId,
    useMemo(() => task?.assignees ?? [], [task?.assignees])
  );

  const copyToClipboardAndShowToast =
    useCopyToClipboardAndShowToast("Invite link copied");
  const createInvite = useCreateInvite();
  const [inviteToTask, inviting] = useRunning(
    useCallback(async () => {
      if (!task) return;
      const inviteLink = await createInvite({
        taskId: task.id,
        permission: RulePermission.VIEW_PROJECTS,
      });
      copyToClipboardAndShowToast(inviteLink);
    }, [createInvite, copyToClipboardAndShowToast, task])
  );

  const shouldShowDefault = useMemo(() => {
    if (!values?.gating) return false;
    if (values.gating === TaskGatingType.ROLES) return !!values.roleIds?.length;
    return true;
  }, [values?.gating, values?.roleIds]);

  if (hidden) return null;
  return (
    <FormSection
      style={{ marginBottom: 0 }}
      label={
        <QuestionmarkTooltip
          name="Assign Someone"
          title="Select a strategy to decide who is allowed to pick up this task."
          marginLeft={4}
          readMoreUrl={deworkSocialLinks.gitbook.bountyTypesAndGating}
          children="Assignee"
        />
      }
    >
      <Form.Item
        name="gating"
        rules={[
          {
            required: true,
            message: "Please select who can work on this task",
          },
        ]}
        style={{
          marginBottom:
            values?.gating === TaskGatingType.ROLES && disabled ? 0 : undefined,
        }}
      >
        <Select
          placeholder="Who can work on this task?"
          optionFilterProp="label"
          allowClear
          disabled={disabled}
        >
          {[
            TaskGatingType.ASSIGNEES,
            TaskGatingType.ROLES,
            TaskGatingType.APPLICATION,
            TaskGatingType.OPEN_SUBMISSION,
          ].map((type: TaskGatingType) => (
            <Select.Option
              key={type}
              value={type}
              disabled={type === TaskGatingType.ROLES && !canManageRoles}
            >
              <Row align="middle" style={{ columnGap: 8 }}>
                {icons[type]}
                {labels[type]}
                {!!descriptions[type] && (
                  <QuestionmarkTooltip
                    name={`Who can work on this task? - ${descriptions[type]}`}
                    title={descriptions[type]}
                  />
                )}
                {type === TaskGatingType.ROLES && (
                  <Tag
                    color="green"
                    style={{
                      fontWeight: "normal",
                      textTransform: "none",
                    }}
                  >
                    New
                  </Tag>
                )}
              </Row>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="assigneeIds"
        hidden={values?.gating !== TaskGatingType.ASSIGNEES}
      >
        <UserSelect
          placeholder={
            canChangeAssignees ? "Select assignee..." : "No task assignee..."
          }
          disabled={!canChangeAssignees}
          mode="multiple"
          users={assigneeOptions}
          dropdownRender={(menu) => (
            <>
              {menu}
              {!!task && (
                <Button
                  block
                  type="text"
                  style={{ textAlign: "left", marginTop: 4 }}
                  className="text-secondary"
                  loading={inviting}
                  icon={<Icons.LinkOutlined />}
                  children="Invite contributor by link"
                  onClick={inviteToTask}
                />
              )}
            </>
          )}
        />
      </Form.Item>
      {values?.gating === TaskGatingType.ROLES && (
        <TaskRoleSelectField
          roleIds={values.roleIds}
          projectId={projectId}
          disabled={disabled}
        />
      )}
      {values?.gating === TaskGatingType.ASSIGNEES &&
        !!values?.roleIds?.length && (
          <TaskRoleSelectField
            roleIds={values.roleIds}
            projectId={projectId}
            disabled
          />
        )}
      {mode === "create" && shouldShowDefault && !disabled && (
        <Form.Item name="defaultGating" valuePropName="checked">
          <Checkbox>
            Use as default
            <QuestionmarkTooltip
              name="Default task checkbox"
              marginLeft={8}
              title="If checked, this task gating will show as default when you create a task in this project. This default is only visible for you within this specific project."
            />
          </Checkbox>
        </Form.Item>
      )}
    </FormSection>
  );
};
