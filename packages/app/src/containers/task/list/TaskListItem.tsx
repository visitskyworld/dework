import { useNavigateToTask } from "@dewo/app/util/navigation";
import { Avatar, Card, Row, Typography } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Task } from "@dewo/app/graphql/types";
import { TaskGatingIcon } from "../card/TaskGatingIcon";
import { TaskTagsRow } from "../board/TaskTagsRow";
import { TaskActionButton } from "../actions/TaskActionButton";
import { TaskRewardTag } from "../TaskRewardTag";
import { TaskStatusIcon } from "@dewo/app/components/icons/task/TaskStatus";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import styles from "./TaskListItem.module.less";
import { usePrefetchTaskDetailsOnHover } from "../card/usePrefetchTaskDetailsOnHover";

interface Props {
  task: Task;
}

export const TaskListItem: FC<Props> = ({ task }) => {
  const navigateToTask = useNavigateToTask(task.id);
  const prefetchTaskDetailsOnHover = usePrefetchTaskDetailsOnHover(task.id);
  return (
    <Card
      size="small"
      className={styles.card}
      onClick={navigateToTask}
      {...prefetchTaskDetailsOnHover}
    >
      <Row align="middle" style={{ columnGap: 16 }}>
        <TaskStatusIcon status={task.status} />
        <TaskGatingIcon task={task} />

        <Typography.Text
          className="font-semibold"
          // ellipsis
          style={{ flex: 1, wordBreak: "break-word" }}
        >
          {task.name}
        </Typography.Text>
        <TaskTagsRow
          task={task}
          extra={
            !!task.reward
              ? [<TaskRewardTag key="reward" reward={task.reward} />]
              : []
          }
          style={{ flex: 1, justifyContent: "flex-end" }}
        />

        <Row justify="end" style={{ width: 44 }}>
          <Avatar.Group
            maxCount={task.assignees.length === 3 ? 3 : 2}
            size={20}
          >
            {task.assignees.map((user) => (
              <UserAvatar key={user.id} user={user} linkToProfile />
            ))}
            {!task.assignees.length && (
              <Avatar size={20} icon={<Icons.UserAddOutlined />} />
            )}
          </Avatar.Group>
        </Row>
        <Row justify="center" style={{ minWidth: 140 }}>
          <TaskActionButton task={task} />
        </Row>
      </Row>
    </Card>
  );
};
