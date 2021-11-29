import _ from "lodash";
import { CreateTaskInput } from "@dewo/api/modules/task/dto/CreateTaskInput";
import { ProjectDetails, Task, UpdateTaskInput } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useCreateTask, useTask, useUpdateTask } from "./hooks";
import { TaskForm } from "./TaskForm";
import { UpdateTaskInput } from "@dewo/api/modules/task/dto/UpdateTaskInput";

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
    }),
    [task, taskId]
  );

  return (
    <Modal
      title="Update Task"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <TaskForm
        key={JSON.stringify(initialValues)}
        project={project}
        initialValues={initialValues}
        buttonText="Update"
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
