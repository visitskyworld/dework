import React, { CSSProperties, FC } from "react";
import { Task, TaskWithOrganization } from "@dewo/app/graphql/types";
import { Row, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { formatTaskReward } from "../hooks";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";

interface Props {
  task: Task | TaskWithOrganization;
  showStandardTags?: boolean;
  style?: CSSProperties;
}

export const TaskTagsRow: FC<Props> = ({
  task,
  showStandardTags = true,
  style,
}) => (
  <Row style={{ ...style, marginBottom: -4 }}>
    {showStandardTags && (
      <>
        {!!task.reward && (
          <Tag
            style={{
              marginBottom: 4,
              backgroundColor: "white",
              color: "black",
            }}
          >
            <Icons.DollarOutlined />
            <span>{formatTaskReward(task.reward)}</span>
          </Tag>
        )}
        {!!task.storyPoints && (
          <Tag style={{ marginBottom: 4 }}>
            <Icons.FlagOutlined />
            <span>{task.storyPoints}</span>
          </Tag>
        )}
        {!!task.subtasks.length && (
          <Tag style={{ marginBottom: 4 }}>
            <Icons.BarsOutlined />
            <span>{task.subtasks.length}</span>
          </Tag>
        )}
        {"project" in task && (
          <Tag
            className="bg-component"
            style={{ marginBottom: 4, paddingLeft: 0 }}
          >
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
    {task.tags.map(({ label, color }, index) => (
      <Tag key={index} color={color} style={{ marginBottom: 4 }}>
        {label}
      </Tag>
    ))}
  </Row>
);
