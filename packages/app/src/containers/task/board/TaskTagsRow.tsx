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
import { TaskPriorityIcon } from "./TaskPriorityIcon";
import { PRIORITY_LABEL } from "./util";

interface Props {
  task: Task | TaskWithOrganization;
  showStandardTags?: boolean;
  style?: CSSProperties;
}

export const TaskTagsRow: FC<Props> = ({
  task,
  showStandardTags = true,
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
        style={{ height: 22 }}
      >
        <TaskPriorityIcon priority={task.priority} />
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
    ...(showStandardTags ? standardTags : []),
    ...task.tags
      .filter((tag) => !tag.deletedAt)
      .map((tag) => (
        <Tag key={tag.id} color={tag.color}>
          {tag.label}
        </Tag>
      )),
  ].filter((c) => !!c);

  if (!tagComponentsToRender.length) return null;
  return (
    <Row style={{ ...style, marginLeft: 0, marginRight: 0, rowGap: 4 }}>
      {tagComponentsToRender}
    </Row>
  );
};
