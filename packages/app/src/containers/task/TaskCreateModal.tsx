import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task } from "@dewo/app/graphql/types";
import { Button, message, Modal, Typography } from "antd";
import React, { FC, useMemo, useCallback } from "react";
import { useCreateTaskFromFormValues } from "./hooks";
import { TaskForm } from "./form/TaskForm";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { AtLeast } from "@dewo/app/types/general";
import { TaskFormValues } from "./form/types";

interface TaskCreateModalProps {
  visible: boolean;
  projectId: string;
  initialValues: AtLeast<TaskFormValues, "status">;
  onCancel(): void;
  onDone(task: Task): unknown;
}

export const TaskCreateModal: FC<TaskCreateModalProps> = ({
  projectId,
  visible,
  initialValues,
  onCancel,
  onDone,
}) => {
  const { user } = useAuthContext();

  const canCreateTaskOwner = usePermission("create", {
    __typename: "Task",
    projectId,
    status: initialValues.status,
    ownerId: user?.id,
  });
  const extendedInitialValues = useMemo<Partial<TaskFormValues>>(
    () => ({
      ownerId: canCreateTaskOwner ? user?.id : undefined,
      ...initialValues,
      gating: (() => {
        const d = user?.taskGatingDefaults.find(
          (d) => d.projectId === projectId
        );
        if (!d) return undefined;
        return { type: d.type, roleIds: d.roles.map((r) => r.id) };
      })(),
    }),
    [initialValues, projectId, canCreateTaskOwner, user]
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
      width={960}
    >
      <TaskForm
        mode="create"
        projectId={projectId}
        initialValues={extendedInitialValues}
        buttonText="Create"
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
