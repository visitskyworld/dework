import React, { FC, useCallback, useMemo } from "react";
import { Emojione } from "react-emoji-render";
import { Task, TaskReaction, TaskStatus } from "@dewo/app/graphql/types";
import { Badge, Col, Row, Tooltip } from "antd";
import _ from "lodash";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { useCreateTaskReaction, useDeleteTaskReaction } from "../../task/hooks";

interface GroupedReaction {
  reaction: string;
  reactions: TaskReaction[];
  selected: boolean;
}

interface Props {
  task: Task;
}

interface ReactionProps {
  taskId: string;
  reaction: GroupedReaction;
}

const TaskReactionItem: FC<ReactionProps> = ({ taskId, reaction }) => {
  const createReaction = useCreateTaskReaction();
  const deleteReaction = useDeleteTaskReaction();
  const handleClick = useCallback(
    async (event) => {
      stopPropagation(event);
      if (reaction.selected) {
        await deleteReaction({ taskId, reaction: reaction.reaction });
      } else {
        await createReaction({ taskId, reaction: reaction.reaction });
      }
    },
    [
      taskId,
      reaction.selected,
      reaction.reaction,
      createReaction,
      deleteReaction,
    ]
  );

  return (
    <Col>
      <Tooltip
        title={`${reaction.selected ? "Remove" : "Add"} ${reaction.reaction}`}
      >
        <Row
          onClick={handleClick}
          className={[
            "dewo-task-reaction",
            "dewo-task-reaction-selectable",
            reaction.selected ? "dewo-task-reaction-selected" : "",
          ]
            .filter((c) => !!c)
            .join(" ")}
        >
          <Emojione svg text={reaction.reaction} className="emojione" />
          <Badge count={reaction.reactions.length} showZero />
        </Row>
      </Tooltip>
    </Col>
  );
};

export const TaskReactionPicker: FC<Props> = ({ task }) => {
  const { user } = useAuthContext();
  const grouped = useMemo(
    () =>
      _(task.reactions)
        .groupBy((r) => r.reaction)
        .map<GroupedReaction>((reactions, reaction) => ({
          reactions,
          reaction,
          selected: reactions.some((r) => r.userId === user?.id),
        }))
        .sortBy((r) => r.reactions.length)
        .value(),
    [task.reactions, user?.id]
  );

  const hasArrowUpSmall = useMemo(
    () => grouped.some((r) => r.reaction === ":arrow_up_small:"),
    [grouped]
  );

  if (!task.reactions.length && task.status !== TaskStatus.BACKLOG) return null;
  return (
    <Row gutter={8}>
      {grouped.map((group) => (
        <TaskReactionItem
          key={group.reaction}
          taskId={task.id}
          reaction={group}
        />
      ))}
      {!hasArrowUpSmall && (
        <TaskReactionItem
          taskId={task.id}
          reaction={{
            reaction: ":arrow_up_small:",
            reactions: [],
            selected: false,
          }}
        />
      )}
    </Row>
  );
};
