import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task } from "@dewo/app/graphql/types";
import { Button, message, Modal, Typography } from "antd";
import React, { FC, useMemo, useCallback } from "react";
import { useCreateTaskFromFormValues } from "./hooks";
import { TaskForm, TaskFormValues } from "./form/TaskForm";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";

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

  const createTask = useCreateTaskFromFormValues();
  const openTask = useNavigateToTaskFn();
  const handleSubmit = useCallback(
    async (values: TaskFormValues) => {
      const task = await createTask(values, projectId);
      onDone(task);
      message.success({
        content: (
          <>
            <Typography.Text style={{ marginRight: 16 }}>
              Task created
            </Typography.Text>
            <Button type="ghost" size="small" onClick={() => openTask(task.id)}>
              View
            </Button>
          </>
        ),
      });
    },
    [createTask, onDone, projectId, openTask]
  );
  return (
    <Modal
      title="Create Task"
      visible={visible}
      destroyOnClose
      maskClosable={false}
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
