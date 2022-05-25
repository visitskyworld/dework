import React, { CSSProperties, FC, useCallback, useMemo } from "react";
import {
  Task,
  TaskViewField,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import { Card, Typography, Row, Rate, Avatar } from "antd";
import { useNavigateToTask } from "@dewo/app/util/navigation";
import { TaskReactionPicker } from "../board/TaskReactionPicker";
import { TaskTagsRow } from "./TaskTagsRow";
import {
  TaskActionButton,
  useTaskActionButton,
} from "../actions/TaskActionButton";
import { TaskGatingIcon } from "./TaskGatingIcon";
import { TaskRewardTag } from "../TaskRewardTag";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { usePrefetchTaskDetailsOnHover } from "./usePrefetchTaskDetailsOnHover";
import { useTaskViewFields } from "../views/TaskViewFieldsContext";
import { NumberOutlined } from "@ant-design/icons";
import moment from "moment";
import { SubtaskList } from "../list/SubtaskList";
import { useSubtasksExpanded } from "@dewo/app/contexts/SubtasksExpandedContext";

interface TaskCardProps {
  task: Task | TaskWithOrganization;
  style?: CSSProperties;
  showReview?: boolean;
  recalculateRowHeight?: () => void;
}

export const TaskCard: FC<TaskCardProps> = ({
  task,
  style,
  showReview,
  recalculateRowHeight,
}) => {
  const navigateToTask = useNavigateToTask(task.id);
  const prefetchProps = usePrefetchTaskDetailsOnHover(task.id);

  const subtasks = useSubtasksExpanded(task.id);
  const toggleSubtasks = subtasks.toggle;
  const handleToggleSubtasks = useCallback(() => {
    toggleSubtasks();
    recalculateRowHeight?.();
  }, [toggleSubtasks, recalculateRowHeight]);

  const fields = useTaskViewFields();
  const taskTagsRowFields = useMemo(
    () => new Set(Array.from(fields).filter((v) => v !== TaskViewField.reward)),
    [fields]
  );

  const shouldRenderReward = !!task.reward && fields.has(TaskViewField.reward);
  const shouldRenderReactions = !!task.reactions.length;
  const shouldRenderTaskActionButton =
    !!useTaskActionButton(task) && fields.has(TaskViewField.button);

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
      {...prefetchProps}
    >
      {fields.has(TaskViewField.number) && (
        <Typography.Paragraph
          type="secondary"
          style={{ marginBottom: 2 }}
          className="ant-typography-caption"
        >
          <NumberOutlined style={{ opacity: 0.3 }} />
          {task.number}
        </Typography.Paragraph>
      )}
      <Row style={{ rowGap: 8 }}>
        <Typography.Text
          className="font-semibold"
          style={{ flex: 1, wordBreak: "break-word", marginRight: 8 }}
        >
          {task.name}
        </Typography.Text>
        {!!task.assignees.length
          ? fields.has(TaskViewField.assignees) && (
              <Avatar.Group
                style={{ alignSelf: "flex-start" }}
                maxCount={task.assignees.length === 3 ? 3 : 2}
                size={20}
              >
                {task.assignees.map((user) => (
                  <UserAvatar key={user.id} user={user} linkToProfile />
                ))}
              </Avatar.Group>
            )
          : fields.has(TaskViewField.gating) && <TaskGatingIcon task={task} />}
      </Row>
      <TaskTagsRow
        task={task}
        style={{ marginTop: 4 }}
        skills="emoji"
        fields={taskTagsRowFields}
        expanded={subtasks.expanded}
        onToggleSubtasks={handleToggleSubtasks}
      />
      {fields.has(TaskViewField.createdAt) && (
        <Typography.Text type="secondary" className="ant-typography-caption">
          {moment(task.createdAt).fromNow()}
        </Typography.Text>
      )}
      {fields.has(TaskViewField.doneAt) && !!task.doneAt && (
        <Typography.Text type="secondary" className="ant-typography-caption">
          {moment(task.doneAt).fromNow()}
        </Typography.Text>
      )}
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
      {subtasks.expanded && !!task.subtasks.length && (
        <SubtaskList subtasks={task.subtasks} style={{ marginTop: 16 }} />
      )}
    </Card>
  );
};
