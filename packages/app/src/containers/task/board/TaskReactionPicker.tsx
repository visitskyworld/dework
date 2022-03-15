import React, { FC, useCallback, useMemo } from "react";
import { Emojione } from "react-emoji-render";
import { Task, TaskReaction, TaskStatus, User } from "@dewo/app/graphql/types";
import { Badge, Button, Col, Row, Table, Tooltip, Typography } from "antd";
import _ from "lodash";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { stopPropagation } from "@dewo/app/util/eatClick";
import {
  useCreateTaskReaction,
  useDeleteTaskReaction,
  useLazyTaskReactionUsers,
} from "../hooks";
import { useToggle } from "@dewo/app/util/hooks";
import Modal from "antd/lib/modal/Modal";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useNavigateToProfile } from "@dewo/app/util/navigation";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

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
  const { user } = useAuthContext();
  const canReact = usePermission("create", {
    __typename: "TaskReaction",
    userId: user?.id!,
  });

  const createReaction = useCreateTaskReaction();
  const deleteReaction = useDeleteTaskReaction();
  const handleClick = useCallback(
    async (event) => {
      stopPropagation(event);
      if (!canReact) return;
      if (reaction.selected) {
        await deleteReaction({ taskId, reaction: reaction.reaction });
      } else {
        await createReaction({ taskId, reaction: reaction.reaction });
      }
    },
    [
      taskId,
      canReact,
      reaction.selected,
      reaction.reaction,
      createReaction,
      deleteReaction,
    ]
  );

  const [fetchTaskReactionUsers, { data }] = useLazyTaskReactionUsers(taskId);
  const users = useMemo(
    () =>
      data?.task.reactions
        .filter((r) => r.reaction === reaction.reaction)
        .map((r) => r.user),
    [data, reaction.reaction]
  );

  const showUsers = useToggle();
  const handleShowUsers = useCallback(
    (event) => {
      stopPropagation(event);
      showUsers.toggleOn();
      fetchTaskReactionUsers();
    },
    [showUsers, fetchTaskReactionUsers]
  );

  const navigateToProfile = useNavigateToProfile();

  return (
    <Col onClick={stopPropagation}>
      <Tooltip
        title={
          <>
            <Typography.Paragraph
              style={{ marginBottom: 4, textAlign: "center" }}
            >
              {reaction.reactions.length === 1
                ? "1 reaction"
                : `${reaction.reactions.length} reactions`}
            </Typography.Paragraph>
            <Button size="small" type="ghost" onClick={handleShowUsers}>
              Show users
            </Button>
          </>
        }
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
      <Modal
        visible={showUsers.isOn}
        footer={null}
        onCancel={showUsers.toggleOff}
      >
        <Table<User>
          dataSource={users}
          size="small"
          loading={!users}
          pagination={{ hideOnSinglePage: true }}
          onRow={(user) => ({ onClick: () => navigateToProfile(user) })}
          style={{ cursor: "pointer" }}
          columns={[
            {
              key: "avatar",
              width: 1,
              render: (_, user: User) => <UserAvatar user={user} />,
            },
            { dataIndex: "username" },
          ]}
        />
      </Modal>
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
