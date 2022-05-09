import React, { CSSProperties, FC, useMemo } from "react";
import {
  Task,
  TaskPriority,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Row, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import moment from "moment";
import { PRIORITY_LABEL } from "./util";
import { TaskPriorityIcon } from "@dewo/app/components/icons/task/TaskPriority";
import { TaskRewardTag } from "../TaskRewardTag";
import { SkillTag } from "@dewo/app/components/SkillTag";

export interface TagOptions {
  properties?: boolean;
  reward?: boolean;
  tags?: boolean;
  skills?: "emoji" | true;
}

const defaultOptions: TagOptions = {
  tags: true,
  skills: true,
};

interface Props {
  task: Task | TaskWithOrganization;
  options?: TagOptions;
  style?: CSSProperties;
}

export const TaskTagsRow: FC<Props> = ({
  task,
  options = defaultOptions,
  style,
}) => {
  const attachmentCount = useMemo(
    () =>
      task.description?.match(/!?\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/gm)
        ?.length ?? 0,
    [task.description]
  );
  const doneSubtasks = useMemo(
    () => task.subtasks.filter((t) => t.status === TaskStatus.DONE),
    [task.subtasks]
  );

  const standardTags = [
    task.priority !== TaskPriority.NONE && (
      <Tag
        key="priority"
        title={PRIORITY_LABEL[task.priority]}
        style={{ height: 20 }}
      >
        <TaskPriorityIcon priority={task.priority} size={13} />
      </Tag>
    ),
    !!task.dueDate && (
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
    !!attachmentCount && (
      <Tag key="attachmentCount">
        <Icons.LinkOutlined />
        <span>{attachmentCount}</span>
      </Tag>
    ),
    !!task.storyPoints && (
      <Tag key="storyPiints">
        <Icons.FlagOutlined />
        <span>{task.storyPoints}</span>
      </Tag>
    ),
    !!task.subtasks.length && (
      <Tag key="subtasks">
        {doneSubtasks.length === task.subtasks.length ? (
          <Icons.CheckCircleFilled style={{ color: Colors.green.primary }} />
        ) : (
          <Icons.CheckCircleOutlined />
        )}
        <span>
          {doneSubtasks.length}/{task.subtasks.length}
        </span>
      </Tag>
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
    ...(options.properties ? standardTags : []),
    ...(options.skills
      ? task.skills.map((skill) => (
          <SkillTag
            key={skill.id}
            mode={options.skills === "emoji" ? "emoji" : undefined}
            skill={skill}
          />
        ))
      : []),
    ...(options.tags
      ? task.tags
          .filter((tag) => !tag.deletedAt)
          .map((tag) => (
            <Tag key={tag.id} color={tag.color}>
              {tag.label}
            </Tag>
          ))
      : []),
    ...(options.reward && !!task.reward
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
