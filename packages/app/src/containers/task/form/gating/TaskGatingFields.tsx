import { Checkbox, Form, Select, Tag, Tooltip } from "antd";
import React, { FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { TaskGatingFormValues } from "../types";
import { TaskRoleSelectField } from "./TaskRoleSelectField";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { RulePermission, TaskGatingType } from "@dewo/app/graphql/types";

const labels: Record<TaskGatingType, string> = {
  [TaskGatingType.APPLICATION]: "Application Process",
  [TaskGatingType.ROLES]: "Specific Roles",
  [TaskGatingType.OPEN_SUBMISSION]: "Contest",
};

const descriptions: Record<TaskGatingType, string> = {
  [TaskGatingType.APPLICATION]:
    "Contributors apply to this task, and the reviewer can assign the best applicant.",
  [TaskGatingType.ROLES]:
    "Contributors with certain roles assign themselves to this task. Anyone can still apply to claim this task, but the selected roles can claim and start working on this without an application.",
  [TaskGatingType.OPEN_SUBMISSION]:
    "Allow anyone to submit a task submission. Submissions will be shown to admins in the task details. From there, review and pick the best submission.",
};

interface Props {
  gating?: Partial<TaskGatingFormValues>;
  disabled: boolean;
  canSetDefault: boolean;
  projectId: string;
}

export const TaskGatingFields: FC<Props> = ({
  gating,
  projectId,
  disabled,
  canSetDefault,
}) => {
  const canManageRoles = usePermission("create", {
    __typename: "Rule",
    permission: RulePermission.MANAGE_TASKS,
    // @ts-ignore
    task: { projectId },
  });

  const shouldShowDefault = useMemo(() => {
    if (!gating) return false;
    if (gating.type === TaskGatingType.APPLICATION) return true;
    if (gating.type === TaskGatingType.OPEN_SUBMISSION) return true;
    if (gating.type === TaskGatingType.ROLES) return !!gating.roleIds?.length;
    return false;
  }, [gating]);

  return (
    <>
      <Form.Item
        name={["gating", "type"]}
        style={{
          marginBottom:
            gating?.type === TaskGatingType.ROLES && disabled ? 0 : undefined,
        }}
        label={
          <>
            Gating
            <Tag
              color="green"
              style={{
                marginLeft: 4,
                fontWeight: "normal",
                textTransform: "none",
              }}
            >
              New
            </Tag>
          </>
        }
      >
        <Select
          placeholder="Who can claim this task?"
          optionFilterProp="label"
          allowClear
          disabled={disabled}
        >
          {Object.values(TaskGatingType).map((type: TaskGatingType) => (
            <Select.Option
              key={type}
              value={type}
              label={labels[type]}
              disabled={type === TaskGatingType.ROLES && !canManageRoles}
            >
              {labels[type]}
              {"  "}
              <Tooltip title={descriptions[type]}>
                <Icons.QuestionCircleOutlined />
              </Tooltip>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {gating?.type === TaskGatingType.ROLES && (
        <TaskRoleSelectField
          roleIds={gating.roleIds}
          projectId={projectId}
          disabled={disabled}
        />
      )}
      <Form.Item
        name={["gating", "default"]}
        valuePropName="checked"
        hidden={!canSetDefault || !shouldShowDefault || disabled}
      >
        <Checkbox>
          Use as default{"  "}
          <Tooltip title="If checked, this task gating will show as default when you create a task in this project. This default is only visible for you within this specific project.">
            <Icons.QuestionCircleOutlined />
          </Tooltip>
        </Checkbox>
      </Form.Item>
    </>
  );
};
