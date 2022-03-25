import React, { CSSProperties, FC } from "react";
import * as Icons from "@ant-design/icons";
import {
  Task,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Card, Typography, Space, Row, Rate, Tag, Tooltip } from "antd";
import { useNavigateToTask } from "@dewo/app/util/navigation";
import { TaskReactionPicker } from "./TaskReactionPicker";
import { TaskTagsRow } from "./TaskTagsRow";
import { TaskActionButton, useTaskActionButton } from "./TaskActionButton";
import { TaskCardAvatars } from "./TaskCardAvatars";
import { formatTaskReward } from "../hooks";

interface TaskCardProps {
  task: Task | TaskWithOrganization;
  style?: CSSProperties;
  showReview?: boolean;
}

export const TaskCard: FC<TaskCardProps> = ({ task, style, showReview }) => {
  const navigateToTask = useNavigateToTask(task.id);

  const shouldRenderReward = !!task.reward;
  const shouldRenderReactions =
    !!task.reactions.length || task.status === TaskStatus.BACKLOG;
  const shouldRenderTaskActionButton = !!useTaskActionButton(task);
  return (
    <Card
      size="small"
      style={style}
      bodyStyle={{ padding: 8 }}
      className="hover:component-highlight"
      actions={
        shouldRenderReward ||
        shouldRenderReactions ||
        shouldRenderTaskActionButton
          ? [
              <Row
                key="footer"
                style={{
                  paddingLeft: 8,
                  paddingRight: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "nowrap",
                }}
              >
                {shouldRenderReward && (
                  <Tooltip title={formatTaskReward(task.reward!)}>
                    <Tag
                      key="reward"
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        maxWidth: 100,
                      }}
                    >
                      <Icons.DollarOutlined />
                      <span
                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {formatTaskReward(task.reward!)}
                      </span>
                    </Tag>
                  </Tooltip>
                )}
                {/* make reactions/button right-aligned */}
                {!shouldRenderReactions && <div />}
                {shouldRenderReactions && (
                  <TaskReactionPicker key="reaction" task={task} />
                )}
                {shouldRenderTaskActionButton && (
                  <TaskActionButton key="action" task={task} />
                )}
              </Row>,
            ]
          : undefined
      }
      onClick={navigateToTask}
    >
      <Space direction="vertical" size={4} style={{ width: "100%" }}>
        <Row>
          <Typography.Text strong style={{ flex: 1, wordBreak: "break-word" }}>
            {task.name}
          </Typography.Text>
          <TaskCardAvatars task={task} />
        </Row>
        <TaskTagsRow task={task} />
      </Space>
      {showReview && (
        <>
          <Row style={{ marginBottom: 4 }}>
            {!!task.review?.rating && (
              <Rate
                disabled
                defaultValue={task.review?.rating}
                style={{ fontSize: 15 }}
              />
            )}
          </Row>
          <Row>
            <Typography.Text>{task.review?.message}</Typography.Text>
          </Row>
        </>
      )}
    </Card>
  );
};
