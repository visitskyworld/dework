import { useNavigateToTask } from "@dewo/app/util/navigation";
import { Avatar, Card, Row, Typography } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { Task, TaskStatus, TaskViewField } from "@dewo/app/graphql/types";
import { TaskGatingIcon } from "../card/TaskGatingIcon";
import { TaskTagsRow } from "../card/TaskTagsRow";
import { TaskActionButton } from "../actions/TaskActionButton";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import styles from "./TaskListItem.module.less";
import { usePrefetchTaskDetailsOnHover } from "../card/usePrefetchTaskDetailsOnHover";
import { NumberOutlined } from "@ant-design/icons";
import { useTaskViewFields } from "../views/hooks";
import { TaskStatusDropdown } from "../../../components/form/TaskStatusDropdown";
import moment from "moment";
import { useUpdateTask } from "../hooks";
import { SubtaskList } from "./SubtaskList";
import { useSubtasksExpanded } from "@dewo/app/contexts/SubtasksExpandedContext";

interface Props {
  task: Task;
  recalculateRowHeight?: () => void;
}

export const TaskListItem: FC<Props> = ({ task, recalculateRowHeight }) => {
  const fields = useTaskViewFields();
  const navigateToTask = useNavigateToTask(task.id);
  const prefetchTaskDetailsOnHover = usePrefetchTaskDetailsOnHover(task.id);

  const updateTask = useUpdateTask();
  const updateStatus = useCallback(
    (status: TaskStatus) => updateTask({ id: task.id, status }, task),
    [updateTask, task]
  );

  const subtasks = useSubtasksExpanded(task.id);
  const toggleSubtasks = subtasks.toggle;
  const handleToggleSubtasks = useCallback(() => {
    toggleSubtasks();
    recalculateRowHeight?.();
  }, [toggleSubtasks, recalculateRowHeight]);

  return (
    <Card
      size="small"
      bordered={false}
      className={styles.card}
      onClick={navigateToTask}
      {...prefetchTaskDetailsOnHover}
    >
      <Row align="middle" style={{ columnGap: 16 }}>
        {fields.has(TaskViewField.status) && (
          <TaskStatusDropdown task={task} onChange={updateStatus} />
        )}
        {fields.has(TaskViewField.gating) && <TaskGatingIcon task={task} />}
        {fields.has(TaskViewField.number) && (
          <Typography.Text
            type="secondary"
            style={{ width: 40 }}
            className="ant-typography-caption"
          >
            <NumberOutlined style={{ opacity: 0.3 }} />
            {task.number}
          </Typography.Text>
        )}

        {fields.has(TaskViewField.name) && (
          <Typography.Text
            className="font-semibold"
            // ellipsis
            style={{ flex: 1, wordBreak: "break-word" }}
          >
            {task.name}
          </Typography.Text>
        )}
        <TaskTagsRow
          task={task}
          fields={fields}
          style={{ flex: 1, justifyContent: "flex-end" }}
          expanded={subtasks.expanded}
          onToggleSubtasks={handleToggleSubtasks}
        />

        {fields.has(TaskViewField.assignees) && (
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
        )}

        {fields.has(TaskViewField.createdAt) && (
          <Typography.Text
            type="secondary"
            className="ant-typography-caption"
            style={{ width: 80 }}
          >
            {moment(task.createdAt).fromNow()}
          </Typography.Text>
        )}

        {fields.has(TaskViewField.button) && (
          <Row justify="center" style={{ minWidth: 140 }}>
            <TaskActionButton task={task} />
          </Row>
        )}
      </Row>

      {!!task.subtasks.length && subtasks.expanded && (
        <SubtaskList
          subtasks={task.subtasks}
          style={{ marginTop: 8 }}
          showBranches
        />
      )}
    </Card>
  );
};
