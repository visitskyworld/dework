import _ from "lodash";
import { Modal, Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useMemo } from "react";
import {
  toTaskReward,
  toTaskRewardFormValues,
  useTask,
  useUpdateTask,
} from "./hooks";
import { TaskForm, TaskFormValues } from "./form/TaskForm";
import { TaskListRow } from "./list/TaskList";

interface Props {
  taskId: string;
  visible: boolean;
  onCancel(): void;
}

export const TaskUpdateModal: FC<Props> = ({ taskId, visible, onCancel }) => {
  const task = useTask(taskId, "cache-and-network");
  const updateTask = useUpdateTask();
  const handleSubmit = useCallback(
    async ({ subtasks, ...values }: TaskFormValues) => {
      const reward = !!values.reward
        ? toTaskReward(values.reward)
        : values.reward;
      if (!reward && _.isEmpty(values)) return;
      await updateTask({ id: task!.id, ...values, reward }, task!);
    },
    [updateTask, task]
  );

  const tagIds = useMemo(() => task?.tags.map((t) => t.id) ?? [], [task?.tags]);
  const initialValues = useMemo<TaskFormValues>(
    () => ({
      id: taskId,
      name: task?.name ?? "",
      description: task?.description ?? undefined,
      storyPoints: task?.storyPoints ?? undefined,
      submission: task?.submission ?? undefined,
      tagIds,
      assigneeIds: task?.assignees.map((a) => a.id) ?? [],
      ownerId: task?.owner?.id,
      status: task?.status!,
      reward: toTaskRewardFormValues(task?.reward ?? undefined),
      subtasks: _(task?.subtasks)
        .sortBy((s) => s.sortKey)
        .map(
          (subtask): TaskListRow => ({
            task: subtask,
            assigneeIds: subtask.assignees.map((a) => a.id),
            name: subtask.name,
            status: subtask.status,
          })
        )
        .value(),
    }),
    [task, taskId, tagIds]
  );

  return (
    <Modal visible={visible} onCancel={onCancel} footer={null} width={768}>
      <Skeleton loading={!task} active paragraph={{ rows: 5 }}>
        {!!task && (
          <TaskForm
            key={taskId}
            mode="update"
            task={task}
            projectId={task!.projectId}
            initialValues={initialValues}
            assignees={task!.assignees}
            onSubmit={handleSubmit}
          />
        )}
      </Skeleton>
    </Modal>
  );
};

export const TaskUpdateModalListener: FC = () => {
  const router = useRouter();
  const taskId = router.query.taskId as string | undefined;
  const closeTaskModal = useCallback(
    () =>
      router.push({
        pathname: router.pathname,
        query: _.omit(router.query, "taskId"),
      }),
    [router]
  );
  return (
    <TaskUpdateModal
      taskId={taskId!}
      visible={!!taskId}
      onCancel={closeTaskModal}
    />
  );
};
