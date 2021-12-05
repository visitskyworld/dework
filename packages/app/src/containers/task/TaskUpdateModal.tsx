import _ from "lodash";
import { ProjectDetails, Task, UpdateTaskInput } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useTask, useUpdateTask } from "./hooks";
import { currencyMultiplier, TaskForm } from "./TaskForm";

interface TaskCreateModalProps {
  taskId: string;
  project: ProjectDetails;
  visible: boolean;
  onCancel(): void;
  onDone(task: Task): unknown;
}

export const TaskUpdateModal: FC<TaskCreateModalProps> = ({
  taskId,
  project,
  visible,
  onCancel,
  onDone,
}) => {
  const task = useTask(taskId);
  const updateTask = useUpdateTask();
  const handleSubmit = useCallback(
    async (input: UpdateTaskInput) => {
      const updated = await updateTask(input, task!);
      await onDone(updated);
    },
    [updateTask, onDone, task]
  );

  const initialValues = useMemo<UpdateTaskInput>(
    () => ({
      id: taskId,
      name: task?.name ?? undefined,
      description: task?.description ?? undefined,
      tagIds: task?.tags.map((t) => t.id),
      assigneeIds: task?.assignees.map((a) => a.id),
      status: task?.status,
      reward: !!task?.reward
        ? {
            amount:
              task.reward.amount /
              (currencyMultiplier[task.reward.currency] ?? 1),
            currency: task.reward.currency,
            trigger: task.reward.trigger,
          }
        : undefined,
    }),
    [task, taskId]
  );

  return (
    <Modal
      title="Update Task"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={768}
    >
      <TaskForm<any>
        key={JSON.stringify(initialValues)}
        mode="update"
        task={task}
        tags={project.taskTags}
        initialValues={initialValues}
        assignees={task?.assignees}
        buttonText="Update"
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
