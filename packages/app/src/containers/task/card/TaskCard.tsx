import React, { CSSProperties, FC } from "react";
import {
  Task,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Card, Typography, Row, Rate, Avatar } from "antd";
import { useNavigateToTask } from "@dewo/app/util/navigation";
import { TaskReactionPicker } from "../board/TaskReactionPicker";
import { TaskTagsRow } from "../board/TaskTagsRow";
import {
  TaskActionButton,
  useTaskActionButton,
} from "../actions/TaskActionButton";
import { TaskGatingIcon } from "./TaskGatingIcon";
import { TaskRewardTag } from "../TaskRewardTag";
import { UserAvatar } from "@dewo/app/components/UserAvatar";

interface TaskCardProps {
  task: Task | TaskWithOrganization;
  style?: CSSProperties;
  showReview?: boolean;
}

export const TaskCard: FC<TaskCardProps> = ({ task, style, showReview }) => {
  const navigateToTask = useNavigateToTask(task.id);

  const shouldRenderReward = !!task.reward;
  const shouldRenderReactions =
    !!task.reactions.length || task.status === TaskStatus.COMMUNITY_SUGGESTIONS;
  const shouldRenderTaskActionButton = !!useTaskActionButton(task);
  return (
    <Card
      size="small"
      style={style}
      bodyStyle={{ padding: 12 }}
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
                {shouldRenderReward && <TaskRewardTag reward={task.reward!} />}
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
      <Row style={{ rowGap: 8 }}>
        <Typography.Text
          className="font-semibold"
          style={{ flex: 1, wordBreak: "break-word", marginRight: 8 }}
        >
          {task.name}
        </Typography.Text>
        {!!task.assignees.length ? (
          <Avatar.Group
            style={{ alignSelf: "flex-start" }}
            maxCount={task.assignees.length === 3 ? 3 : 2}
            size={20}
          >
            {task.assignees.map((user) => (
              <UserAvatar key={user.id} user={user} linkToProfile />
            ))}
          </Avatar.Group>
        ) : (
          <TaskGatingIcon task={task} />
        )}
      </Row>
      <TaskTagsRow task={task} style={{ marginTop: 8 }} />
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
