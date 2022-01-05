import React, { FC, useCallback, useMemo } from "react";
import { Emojione } from "react-emoji-render";
import { Task, TaskReaction } from "@dewo/app/graphql/types";
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
        .concat({
          reaction: ":arrow_up_small:",
          reactions: [],
          selected: false,
        })
        .uniqBy((r) => r.reaction)
        .value(),
    [task.reactions, user?.id]
  );

  if (!task.reactions) return null;
  return (
    <Row gutter={8}>
      {grouped.map((group) => (
        <TaskReactionItem
          key={group.reaction}
          taskId={task.id}
          reaction={group}
        />
      ))}
    </Row>
  );
};
