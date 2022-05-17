import { SkillSelect } from "@dewo/app/components/form/SkillSelect";
import { UserSelect } from "@dewo/app/components/form/UserSelect";
import { TaskPriorityIcon } from "@dewo/app/components/icons/task/TaskPriority";
import { TaskStatusIcon } from "@dewo/app/components/icons/task/TaskStatus";
import { RoleTag } from "@dewo/app/components/RoleTag";
import {
  TaskPriority,
  TaskStatus,
  TaskViewFilterType,
} from "@dewo/app/graphql/types";
import { Form, Row, Select, Space } from "antd";
import _ from "lodash";
import React, { FC, useMemo } from "react";
import { PRIORITY_LABEL, STATUS_LABEL } from "../../board/util";
import { TaskViewTagSelect } from "./TaskViewTagSelect";
import { useTaskViewContext } from "../TaskViewContext";
import { Rule } from "antd/lib/form";

interface Props {
  name: string | number;
  type: TaskViewFilterType;
  onClear(): void;
}

const atLeastOneRule = (subjectName: string): Rule[] => [
  {
    type: "array",
    min: 1,
    message: `Select at least one ${subjectName}`,
  },
];

const TagFilter: FC<Props> = ({ name, onClear }) => {
  const { tags, currentView } = useTaskViewContext();
  return (
    <Form.Item
      name={[name, "tagIds"]}
      style={{ flex: 1 }}
      rules={atLeastOneRule("tag")}
    >
      <TaskViewTagSelect
        tags={tags}
        organizationId={currentView?.organizationId ?? undefined}
        onClear={onClear}
      />
    </Form.Item>
  );
};

const AssigneeFilter: FC<Props> = ({ name, onClear }) => {
  const { filterableMembers } = useTaskViewContext();
  return (
    <Form.Item
      name={[name, "assigneeIds"]}
      style={{ flex: 1 }}
      rules={atLeastOneRule("assignee")}
    >
      <UserSelect
        mode="multiple"
        placeholder="Select assignees..."
        showUnassigned
        users={filterableMembers}
        onClear={onClear}
      />
    </Form.Item>
  );
};

const OwnerFilter: FC<Props> = ({ name, onClear }) => {
  const { filterableMembers } = useTaskViewContext();
  return (
    <Form.Item
      name={[name, "ownerIds"]}
      style={{ flex: 1 }}
      rules={atLeastOneRule("reviewer")}
    >
      <UserSelect
        mode="multiple"
        placeholder="Select reviewers..."
        users={filterableMembers}
        onClear={onClear}
      />
    </Form.Item>
  );
};

const StatusFilter: FC<Props> = ({ name, onClear }) => {
  const { showBacklog } = useTaskViewContext();
  return (
    <Form.Item
      name={[name, "statuses"]}
      style={{ flex: 1 }}
      rules={atLeastOneRule("status")}
    >
      <Select
        placeholder="Select task statuses..."
        mode="multiple"
        allowClear
        onClear={onClear}
      >
        {[
          showBacklog && TaskStatus.BACKLOG,
          TaskStatus.TODO,
          TaskStatus.IN_PROGRESS,
          TaskStatus.IN_REVIEW,
          TaskStatus.DONE,
        ]
          .filter((s): s is TaskStatus => !!s)
          .map((status) => (
            <Select.Option key={status} value={status}>
              <Row align="middle" style={{ columnGap: 8 }}>
                <TaskStatusIcon status={status} />
                {STATUS_LABEL[status]}
              </Row>
            </Select.Option>
          ))}
      </Select>
    </Form.Item>
  );
};

const PriorityFilter: FC<Props> = ({ name, onClear }) => {
  return (
    <Form.Item
      name={[name, "priorities"]}
      style={{ flex: 1 }}
      rules={atLeastOneRule("priority")}
    >
      <Select
        placeholder="Select task priorities..."
        mode="multiple"
        allowClear
        onClear={onClear}
      >
        {[
          TaskPriority.NONE,
          TaskPriority.LOW,
          TaskPriority.MEDIUM,
          TaskPriority.HIGH,
          TaskPriority.URGENT,
        ].map((priority) => (
          <Select.Option key={priority} value={priority}>
            <Space>
              <TaskPriorityIcon priority={priority} size={13} />
              {PRIORITY_LABEL[priority]}
            </Space>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

const RoleFilter: FC<Props> = ({ name, onClear }) => {
  const { roles } = useTaskViewContext();
  const organizationRoles = useMemo(
    () => roles?.filter((role) => !role.userId && !role.fallback),
    [roles]
  );

  const roleById = useMemo(() => _.keyBy(roles, (r) => r.id), [roles]);
  return (
    <Form.Item
      name={[name, "roleIds"]}
      style={{ flex: 1 }}
      rules={atLeastOneRule("role")}
    >
      <Select
        mode="multiple"
        placeholder="Select roles..."
        optionFilterProp="label"
        loading={!organizationRoles}
        allowClear
        onClear={onClear}
        tagRender={(props) =>
          !!roleById[props.value] && (
            <RoleTag {...props} role={roleById[props.value]} />
          )
        }
      >
        {organizationRoles?.map((role) => (
          <Select.Option
            key={role.id}
            value={role.id}
            label={role.name}
            style={{ fontWeight: "unset" }}
          >
            <RoleTag role={role} />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

const SkillFilter: FC<Props> = ({ name, onClear }) => (
  <Form.Item
    name={[name, "skillIds"]}
    style={{ flex: 1 }}
    rules={atLeastOneRule("skill")}
  >
    <SkillSelect placeholder="Select skills..." allowClear onClear={onClear} />
  </Form.Item>
);

export const TaskViewFormFilterRow: FC<Props> = (props) => {
  switch (props.type) {
    case TaskViewFilterType.TAGS:
      return <TagFilter {...props} />;
    case TaskViewFilterType.ASSIGNEES:
      return <AssigneeFilter {...props} />;
    case TaskViewFilterType.OWNERS:
      return <OwnerFilter {...props} />;
    case TaskViewFilterType.STATUSES:
      return <StatusFilter {...props} />;
    case TaskViewFilterType.PRIORITIES:
      return <PriorityFilter {...props} />;
    case TaskViewFilterType.ROLES:
      return <RoleFilter {...props} />;
    case TaskViewFilterType.SKILLS:
      return <SkillFilter {...props} />;
    default:
      return null;
  }
};
