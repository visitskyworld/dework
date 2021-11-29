import { CreateTaskInput } from "@dewo/api/modules/task/dto/CreateTaskInput";
import { ProjectDetails, Task } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC, useCallback } from "react";
import { useCreateTask } from "./hooks";
import { TaskForm } from "./TaskForm";

interface TaskCreateModalProps {
  project: ProjectDetails;
  visible: boolean;
  initialValues: Partial<CreateTaskInput>;
  onCancel(): void;
  onDone(task: Task): unknown;
}

export const TaskCreateModal: FC<TaskCreateModalProps> = ({
  project,
  visible,
  initialValues,
  onCancel,
  onDone,
}) => {
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
    >
      <TaskForm
        project={project}
        initialValues={initialValues}
        buttonText="Create"
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
