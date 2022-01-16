import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC, useMemo, useCallback } from "react";
import { useCreateTask, useCreateTaskReaction } from "./hooks";
import { TaskForm, TaskFormValues } from "./form/TaskForm";

interface TaskCreateModalProps {
  visible: boolean;
  projectId: string;
  initialValues: Partial<TaskFormValues>;
  onCancel(): void;
  onDone(task: Task): unknown;
}

export const TaskCreateModal: FC<TaskCreateModalProps> = ({
  projectId,
  visible,
  initialValues: _initialValues,
  onCancel,
  onDone,
}) => {
  const { user } = useAuthContext();

  const canCreateTaskOwner = usePermission("create", "Task", "ownerId");
  const initialValues = useMemo<Partial<TaskFormValues>>(
    () =>
      canCreateTaskOwner
        ? { ownerId: user?.id, ..._initialValues }
        : _initialValues,
    [_initialValues, canCreateTaskOwner, user?.id]
  );

  const createTask = useCreateTask();
  const createTaskReaction = useCreateTaskReaction();
  const handleSubmit = useCallback(
    async ({ subtasks, ...values }: TaskFormValues) => {
      const task = await createTask(values, projectId);
      if (values.status === TaskStatus.BACKLOG) {
        await createTaskReaction({
          taskId: task.id,
          reaction: ":arrow_up_small:",
        });
      }

      for (const subtask of subtasks ?? []) {
        await createTask(
          {
            parentTaskId: task.id,
            name: subtask.name,
            assigneeIds: subtask.assigneeIds,
            status: subtask.status,
            tagIds: [],
          },
          task.projectId
        );
      }

      await onDone(task);
    },
    [createTask, onDone, createTaskReaction, projectId]
  );
  return (
    <Modal
      title="Create Task"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={768}
    >
      <TaskForm
        mode="create"
        projectId={projectId}
        initialValues={initialValues}
        buttonText="Create"
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
