import { Task } from "@dewo/app/graphql/types";
import _ from "lodash";
import { Modal } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useMemo } from "react";
import { toTaskRewardFormValues, useTask, useUpdateTask } from "./hooks";
import { TaskForm, TaskFormValues } from "./TaskForm";

interface Props {
  taskId: string;
  visible: boolean;
  onCancel(): void;
  onDone(task: Task): unknown;
}

export const TaskUpdateModal: FC<Props> = ({
  taskId,
  visible,
  onCancel,
  onDone,
}) => {
  const task = useTask(taskId);
  const updateTask = useUpdateTask();
  const handleSubmit = useCallback(
    async (input: TaskFormValues) => {
      const updated = await updateTask(input, task!);
      await onDone(updated);
    },
    [updateTask, onDone, task]
  );

  const initialValues = useMemo<TaskFormValues>(
    () => ({
      id: taskId,
      name: task?.name ?? undefined,
      description: task?.description ?? undefined,
      tagIds: task?.tags.map((t) => t.id) ?? [],
      assigneeIds: task?.assignees.map((a) => a.id) ?? [],
      ownerId: task?.owner?.id,
      status: task?.status!,
      reward: toTaskRewardFormValues(task?.reward ?? undefined),
    }),
    [task, taskId]
  );

  return (
    <Modal visible={visible} onCancel={onCancel} footer={null} width={768}>
      <TaskForm
        key={JSON.stringify(initialValues)}
        mode="update"
        task={task}
        tags={task?.project.taskTags ?? []}
        initialValues={initialValues}
        assignees={task?.assignees}
        buttonText="Update"
        onSubmit={handleSubmit}
      />
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
      onDone={closeTaskModal}
    />
  );
};
