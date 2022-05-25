import React, { CSSProperties, FC } from "react";
import {
  Task,
  TaskPriority,
  TaskStatus,
  TaskViewField,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Row, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import moment from "moment";
import { PRIORITY_LABEL } from "../board/util";
import { TaskPriorityIcon } from "@dewo/app/components/icons/task/TaskPriority";
import { TaskRewardTag } from "../TaskRewardTag";
import { SkillTag } from "@dewo/app/components/SkillTag";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import { useUpdateTask } from "../hooks";
import { SubtaskTagButton } from "./SubtaskTagButton";

interface Props {
  task: Task | TaskWithOrganization;
  fields?: Set<TaskViewField>;
  skills?: "default" | "emoji";
  style?: CSSProperties;
  expanded?: boolean;
  onToggleSubtasks?(): void;
}

const defaultFields = new Set([TaskViewField.tags, TaskViewField.skills]);

export const TaskTagsRow: FC<Props> = ({
  task,
  fields = defaultFields,
  skills,
  style,
  expanded,
  onToggleSubtasks,
}) => {
  const canChangePriority = usePermission("update", task, "priority");
  const updateTask = useUpdateTask();

  const standardTags = [
    fields.has(TaskViewField.priority) && (
      <DropdownSelect
        key="priority"
        mode="default"
        disabled={!canChangePriority}
        onChange={(priority: TaskPriority) =>
          updateTask({ id: task.id, priority }, task)
        }
        options={(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map(
          (priority) => ({
            value: priority,
            label: (
              <Row align="middle" style={{ columnGap: 8 }}>
                <TaskPriorityIcon priority={priority} size={13} />
                {PRIORITY_LABEL[priority]}
              </Row>
            ),
          })
        )}
      >
        <Tag title={PRIORITY_LABEL[task.priority]} style={{ height: 20 }}>
          <TaskPriorityIcon priority={task.priority} size={13} />
        </Tag>
      </DropdownSelect>
    ),
    fields.has(TaskViewField.dueDate) && !!task.dueDate && (
      <Tag key="dueDate">
        {task.status !== TaskStatus.DONE &&
        moment().endOf("day").isAfter(task.dueDate) ? (
          <Icons.ExclamationCircleFilled
            style={{ color: Colors.red.primary }}
          />
        ) : (
          <Icons.CalendarOutlined />
        )}
        <span>{moment(task.dueDate).format("D MMM")}</span>
      </Tag>
    ),
    !!task.storyPoints && (
      <Tag key="storyPiints">
        <Icons.FlagOutlined />
        <span>{task.storyPoints}</span>
      </Tag>
    ),
    !!task.subtasks.length && (
      <SubtaskTagButton
        key="subtasks"
        subtasks={task.subtasks}
        expanded={expanded}
        onToggle={onToggleSubtasks}
      />
    ),
    "project" in task && (
      <Tag key="project" style={{ paddingLeft: 0 }}>
        <OrganizationAvatar
          organization={task.project.organization}
          size={20}
        />
        <Typography.Text style={{ marginLeft: 4 }}>
          {task.project.organization.name}
        </Typography.Text>
      </Tag>
    ),
  ];

  const tagComponentsToRender = [
    standardTags,
    ...(fields.has(TaskViewField.skills)
      ? task.skills.map((skill) => (
          <SkillTag key={skill.id} mode={skills} skill={skill} />
        ))
      : []),
    ...(fields.has(TaskViewField.tags)
      ? task.tags
          .filter((tag) => !tag.deletedAt)
          .map((tag) => (
            <Tag key={tag.id} color={tag.color}>
              {tag.label}
            </Tag>
          ))
      : []),
    ...(fields.has(TaskViewField.reward) && !!task.reward
      ? [<TaskRewardTag key="reward" reward={task.reward} />]
      : []),
  ].filter((c) => !!c);

  if (!tagComponentsToRender.length) return null;
  return (
    <Row style={{ ...style, marginLeft: 0, marginRight: 0, rowGap: 4 }}>
      {tagComponentsToRender}
    </Row>
  );
};
