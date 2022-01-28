import React, { CSSProperties, FC, useMemo } from "react";
import {
  Task,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Row, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { formatTaskReward } from "../hooks";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import moment from "moment";

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
  if (!showStandardTags && !task.tags.length) return null;
  return (
    <Row gutter={[8, 4]} style={{ ...style }}>
      {showStandardTags && (
        <>
          {!!task.reward && (
            <Tag style={{ backgroundColor: "white", color: "black" }}>
              <Icons.DollarOutlined />
              <span>{formatTaskReward(task.reward)}</span>
            </Tag>
          )}
          {!!task.dueDate && (
            <Tag>
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
          )}
          {!!attachmentCount && (
            <Tag>
              <Icons.LinkOutlined />
              <span>{attachmentCount}</span>
            </Tag>
          )}
          {!!task.storyPoints && (
            <Tag>
              <Icons.FlagOutlined />
              <span>{task.storyPoints}</span>
            </Tag>
          )}
          {!!task.subtasks.length && (
            <Tag>
              {doneSubtasks.length === task.subtasks.length ? (
                <Icons.CheckCircleFilled
                  style={{ color: Colors.green.primary }}
                />
              ) : (
                <Icons.CheckCircleOutlined />
              )}
              <span>
                {doneSubtasks.length}/{task.subtasks.length}
              </span>
            </Tag>
          )}
          {"project" in task && (
            <Tag className="bg-component" style={{ paddingLeft: 0 }}>
              <OrganizationAvatar
                organization={task.project.organization}
                size={20}
              />
              <Typography.Text style={{ marginLeft: 4 }}>
                {task.project.organization.name}
              </Typography.Text>
            </Tag>
          )}
        </>
      )}
      {task.tags.map((tag) => (
        <Tag key={tag.id} color={tag.color}>
          {tag.label}
        </Tag>
      ))}
    </Row>
  );
};
