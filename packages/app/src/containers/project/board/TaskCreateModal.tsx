import { CreateTaskInput } from "@dewo/api/modules/task/dto/CreateTaskInput";
import { ProjectDetails, Task } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC } from "react";
import { TaskCreateForm } from "./TaskCreateForm";

interface TaskCreateModalProps {
  project: ProjectDetails;
  visible: boolean;
  initialValues: Partial<CreateTaskInput>;
  onCancel(): void;
  onCreated(project: Task): unknown;
}

export const TaskCreateModal: FC<TaskCreateModalProps> = ({
  project,
  visible,
  initialValues,
  onCancel,
  onCreated,
}) => {
  return (
    <Modal
      title="Create Task"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <TaskCreateForm
        project={project}
        initialValues={initialValues}
        onCreated={onCreated}
      />
    </Modal>
  );
};
