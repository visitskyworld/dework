import { MarkdownPreview } from "@dewo/app/components/markdownEditor/MarkdownPreview";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task, User } from "@dewo/app/graphql/types";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Button, Card, Col, Row, Tooltip, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { TaskBoardColumnEmpty } from "../../task/board/TaskBoardColumnEmtpy";
import { TaskTagsRow } from "../../task/board/TaskTagsRow";
import { useCreateTaskReaction, useDeleteTaskReaction } from "../../task/hooks";
import { TaskRow } from "./CommunitySuggestions";
import * as Icons from "@ant-design/icons";
import { useReactionModal } from "@dewo/app/src/util/reactions";

const UPVOTE_REACTION = ":arrow_up_small:";

const ProfileLink: FC<{ user: User }> = ({ user }) => {
  if (!user) return null;
  return (
    <UserAvatar
      linkToProfile
      user={user}
      size="small"
      tooltip={{ title: "View profile" }}
    />
  );
};

interface UpvoteProps {
  taskRow: TaskRow;
}

const UpvoteCard: FC<UpvoteProps> = ({ taskRow }) => {
  const { user } = useAuthContext();
  const canReact = usePermission("create", {
    __typename: "TaskReaction",
    userId: user?.id!,
  });
  const createReaction = useCreateTaskReaction();
  const deleteReaction = useDeleteTaskReaction();

  const selected = useMemo(
    () =>
      taskRow.task.reactions.some(
        (r) => r.reaction === UPVOTE_REACTION && r.userId === user?.id
      ),
    [taskRow, user]
  );

  const handleUpvote = useCallback(
    async (event) => {
      stopPropagation(event);
      if (!canReact) return;
      if (selected) {
        await deleteReaction({
          taskId: taskRow.task.id,
          reaction: UPVOTE_REACTION,
        });
      } else {
        await createReaction({
          taskId: taskRow.task.id,
          reaction: UPVOTE_REACTION,
        });
      }
    },
    [createReaction, deleteReaction, taskRow, selected, canReact]
  );

  const [showReactions, ReactionsModal] = useReactionModal(
    taskRow.task.id,
    UPVOTE_REACTION
  );

  return (
    <Col onClick={stopPropagation}>
      <Tooltip
        title={
          <>
            <Row justify="center">
              <Typography.Paragraph
                style={{ marginBottom: 4, textAlign: "center" }}
              >
                Upvote suggestion
              </Typography.Paragraph>
            </Row>
            <Row justify="center">
              <Button size="small" type="ghost" onClick={showReactions}>
                {taskRow.upvotes === 1
                  ? "1 upvote"
                  : `${taskRow.upvotes} upvotes`}
              </Button>
            </Row>
          </>
        }
      >
        <Card
          bodyStyle={{
            padding: 8,
            display: "grid",
            minWidth: 56,
            placeItems: "center",
          }}
          bordered={false}
          className={[
            "pointer-cursor",
            "dewo-suggestion-card",
            selected && "dewo-suggestion-upvoted",
          ]
            .filter((a) => a)
            .join(" ")}
          onClick={handleUpvote}
          hoverable
        >
          <Icons.CaretUpOutlined className="ant-typography-h4" />
          <Typography.Text strong>{taskRow.upvotes}</Typography.Text>
        </Card>
      </Tooltip>
      <ReactionsModal />
    </Col>
  );
};

interface Props {
  taskRows: TaskRow[];
}
export const SuggestionsList: FC<Props> = ({ taskRows }) => {
  const navigateToTask = useNavigateToTaskFn();
  const handleClick = useCallback(
    (task: Task) => navigateToTask(task.id),
    [navigateToTask]
  );

  if (taskRows.length === 0) {
    return (
      <Row justify="center">
        <TaskBoardColumnEmpty
          title={
            <Typography.Paragraph type="secondary">
              This project doesn't have any suggestions yet. Be the first to add
              one!
            </Typography.Paragraph>
          }
          icon={<Icons.BulbOutlined />}
        />
      </Row>
    );
  }

  return (
    <>
      {taskRows.map((taskRow, index) => (
        <Card
          hoverable
          onClick={() => handleClick(taskRow.task)}
          bordered={false}
          style={{ marginBottom: 20 }}
          key={taskRow.task.id}
        >
          <Row wrap={false}>
            <Col>
              <UpvoteCard
                // To stop the tooltip from bugging out when a suggestion changes place
                key={taskRow.task.id + "/" + index}
                taskRow={taskRow}
              />
            </Col>
            <Col flex="24px" />
            <Col
              flex="auto"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Row>
                <Typography.Title style={{ marginBottom: 0 }} level={5}>
                  {taskRow.task.name}
                </Typography.Title>
              </Row>
              {taskRow.task.tags.length > 0 && (
                <Row style={{ marginBottom: 5, marginTop: 5 }}>
                  <TaskTagsRow task={taskRow.task} />
                </Row>
              )}
              <Row>
                {!!taskRow.task.description && (
                  <MarkdownPreview
                    style={{ wordBreak: "break-all" }}
                    value={taskRow.task.description}
                  />
                )}
              </Row>
            </Col>
            <Col>
              {taskRow.task.owner && <ProfileLink user={taskRow.task.owner} />}
            </Col>
          </Row>
        </Card>
      ))}
    </>
  );
};