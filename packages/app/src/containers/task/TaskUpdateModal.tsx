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
import { TaskForm, TaskFormValues } from "./TaskForm";

interface Props {
  taskId: string;
  visible: boolean;
  onCancel(): void;
}

export const TaskUpdateModal: FC<Props> = ({ taskId, visible, onCancel }) => {
  const task = useTask(taskId, "cache-and-network");
  const updateTask = useUpdateTask();
  const handleSubmit = useCallback(
    async (values: TaskFormValues) =>
      updateTask(
        {
          id: task!.id,
          ...values,
          reward: !!values.reward ? toTaskReward(values.reward) : values.reward,
        },
        task!
      ),
    [updateTask, task]
  );

  const tagIds = useMemo(() => task?.tags.map((t) => t.id) ?? [], [task?.tags]);
  const initialValues = useMemo<TaskFormValues>(
    () => ({
      id: taskId,
      name: task?.name ?? "",
      description: task?.description ?? "",
      tagIds,
      assigneeIds: task?.assignees.map((a) => a.id) ?? [],
      ownerId: task?.owner?.id,
      status: task?.status!,
      reward: toTaskRewardFormValues(task?.reward ?? undefined),
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
            buttonText="Update"
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
