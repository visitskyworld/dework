import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Task, TaskTag } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC, useMemo, useCallback } from "react";
import { useCreateTask } from "./hooks";
import { TaskForm, TaskFormValues } from "./TaskForm";

interface TaskCreateModalProps {
  tags: TaskTag[];
  visible: boolean;
  projectId: string;
  initialValues: Partial<TaskFormValues>;
  onCancel(): void;
  onDone(task: Task): unknown;
}

export const TaskCreateModal: FC<TaskCreateModalProps> = ({
  tags,
  projectId,
  visible,
  initialValues: _initialValues,
  onCancel,
  onDone,
}) => {
  const { user } = useAuthContext();
  const initialValues = useMemo<Partial<TaskFormValues>>(
    () => ({ ownerId: user?.id, ..._initialValues }),
    [_initialValues, user?.id]
  );

  const createTask = useCreateTask();
  const handleSubmit = useCallback(
    async (values: TaskFormValues) => {
      const task = await createTask(values, projectId);
      await onDone(task);
    },
    [createTask, onDone, projectId]
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
        tags={tags}
        initialValues={initialValues}
        buttonText="Create"
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
