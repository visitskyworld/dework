import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { CreateTaskInput, Task, TaskTag } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC, useMemo, useCallback } from "react";
import { useCreateTask } from "./hooks";
import { TaskForm } from "./TaskForm";

interface TaskCreateModalProps {
  tags: TaskTag[];
  visible: boolean;
  initialValues: Partial<CreateTaskInput>;
  onCancel(): void;
  onDone(task: Task): unknown;
}

export const TaskCreateModal: FC<TaskCreateModalProps> = ({
  tags,
  visible,
  initialValues: _initialValues,
  onCancel,
  onDone,
}) => {
  const { user } = useAuthContext();
  const initialValues = useMemo<Partial<CreateTaskInput>>(
    () => ({ ownerId: user?.id, ..._initialValues }),
    [_initialValues, user?.id]
  );

  const createTask = useCreateTask();
  const handleSubmit = useCallback(
    async (input: CreateTaskInput) => {
      const task = await createTask(input);
      await onDone(task);
    },
    [createTask, onDone]
  );
  return (
    <Modal
      title="Create Task"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={768}
    >
      <TaskForm<CreateTaskInput>
        mode="create"
        tags={tags}
        initialValues={initialValues}
        buttonText="Create"
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
