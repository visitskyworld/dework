import { UserSelect } from "@dewo/app/components/form/UserSelect";
import { RoleTag } from "@dewo/app/components/RoleTag";
import { useOrganizationUsers } from "@dewo/app/containers/organization/hooks";
import {
  useProject,
  useProjectDetails,
  useProjectTaskTags,
} from "@dewo/app/containers/project/hooks";
import { useOrganizationRoles } from "@dewo/app/containers/rbac/hooks";
import {
  TaskPriority,
  TaskStatus,
  TaskViewFilterType,
} from "@dewo/app/graphql/types";
import { Form, Select, Space } from "antd";
import _ from "lodash";
import React, { FC, useMemo } from "react";
import { TaskPriorityIcon } from "../../board/TaskPriorityIcon";
import { PRIORITY_LABEL, STATUS_LABEL } from "../../board/util";
import { TaskTagSelectField } from "../../form/TaskTagSelectField";

interface Props {
  name: string | number;
  type: TaskViewFilterType;
  projectId: string;
  onClear(): void;
}

const TagFilter: FC<Props> = ({ name, projectId, onClear }) => {
  const tags = useProjectTaskTags(projectId);
  return (
    <TaskTagSelectField
      style={{ flex: 1 }}
      name={[name, "tagIds"]}
      tags={tags}
      rules={[
        {
          type: "array",
          min: 1,
          message: "Select at least one tag",
        },
      ]}
      allowClear
      onClear={onClear}
    />
  );
};

const AssigneeFilter: FC<Props> = ({ name, projectId, onClear }) => {
  const { project } = useProject(projectId);
  const { users } = useOrganizationUsers(project?.organizationId);
  return (
    <Form.Item
      name={[name, "assigneeIds"]}
      style={{ flex: 1 }}
      rules={[
        {
          type: "array",
          min: 1,
          message: "Select at least one assignee",
        },
      ]}
    >
      <UserSelect
        mode="multiple"
        placeholder="Select assignees..."
        showUnassigned
        users={users}
        onClear={onClear}
      />
    </Form.Item>
  );
};

const OwnerFilter: FC<Props> = ({ name, projectId, onClear }) => {
  const { project } = useProject(projectId);
  const { users } = useOrganizationUsers(project?.organizationId);
  return (
    <Form.Item
      name={[name, "ownerIds"]}
      style={{ flex: 1 }}
      rules={[
        {
          type: "array",
          min: 1,
          message: "Select at least one reviewer",
        },
      ]}
    >
      <UserSelect
        mode="multiple"
        placeholder="Select reviewers..."
        users={users}
        onClear={onClear}
      />
    </Form.Item>
  );
};

const StatusFilter: FC<Props> = ({ name, projectId, onClear }) => {
  const showBacklog =
    useProjectDetails(projectId).project?.options?.showBacklogColumn;
  return (
    <Form.Item
      name={[name, "statuses"]}
      style={{ flex: 1 }}
      rules={[
        {
          type: "array",
          min: 1,
          message: "Select at least one status",
        },
      ]}
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
              {STATUS_LABEL[status]}
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
      rules={[
        {
          type: "array",
          min: 1,
          message: "Select at least one priority",
        },
      ]}
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
              <TaskPriorityIcon priority={priority} />
              {PRIORITY_LABEL[priority]}
            </Space>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

const RoleFilter: FC<Props> = ({ name, projectId, onClear }) => {
  const { project } = useProject(projectId);
  const roles = useOrganizationRoles(project?.organizationId);
  const organizationRoles = useMemo(
    () => roles?.filter((role) => !role.userId && !role.fallback),
    [roles]
  );

  const roleById = useMemo(() => _.keyBy(roles, (r) => r.id), [roles]);
  return (
    <Form.Item
      name={[name, "roleIds"]}
      style={{ flex: 1 }}
      rules={[
        {
          type: "array",
          min: 1,
          message: "Select at least one role",
        },
      ]}
    >
      <Select
        mode="multiple"
        placeholder="Select roles..."
        optionFilterProp="label"
        loading={!organizationRoles}
        allowClear
        onClear={onClear}
        tagRender={(props) => (
          <RoleTag {...props} role={roleById[props.value]} />
        )}
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
    default:
      return null;
  }
};
