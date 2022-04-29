import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task } from "@dewo/app/graphql/types";
import { Button, message, Modal, Typography } from "antd";
import React, { FC, useMemo, useCallback } from "react";
import { useCreateTaskFromFormValues } from "./hooks";
import { TaskForm } from "./form/TaskForm";
import { AtLeast } from "@dewo/app/types/general";
import { TaskFormValues } from "./form/types";
import { useRouter } from "next/router";
import { useProject } from "../project/hooks";
import moment from "moment";

const buildKey = (initialValues: Partial<TaskFormValues>) =>
  `TaskCreateModal.storedValues(${JSON.stringify(
    initialValues,
    Object.keys(initialValues).sort()
  )})`;

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

  const storedValuesKey = useMemo(
    () => buildKey(initialValues),
    [initialValues]
  );
  const storedValues = useMemo(() => {
    try {
      const storedValuesString = localStorage.getItem(storedValuesKey);
      if (!storedValuesString) return undefined;
      return JSON.parse(storedValuesString);
    } catch {
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedValuesKey, visible]);
  const clearStoredValues = useCallback(
    () => localStorage.removeItem(storedValuesKey),
    [storedValuesKey]
  );
  const setStoredValues = useCallback(
    (values: Partial<TaskFormValues>) =>
      localStorage.setItem(storedValuesKey, JSON.stringify(values)),
    [storedValuesKey]
  );

  const canCreateTaskOwner = usePermission("create", {
    __typename: "Task",
    projectId,
    status: initialValues.status,
    owners: !!user ? [user] : [],
  });
  const extendedInitialValues = useMemo<Partial<TaskFormValues>>(() => {
    const taskGatingDefault = user?.taskGatingDefaults.find(
      (d) => d.projectId === projectId
    );
    return {
      ownerIds: canCreateTaskOwner && !!user ? [user.id] : [],
      gating: taskGatingDefault?.type,
      roleIds: taskGatingDefault?.roles.map((r) => r.id),
      ...storedValues,
      dueDate: !!storedValues?.dueDate
        ? moment(storedValues.dueDate)
        : undefined,
      ...initialValues,
    };
  }, [initialValues, storedValues, projectId, canCreateTaskOwner, user]);

  const createTask = useCreateTaskFromFormValues();
  const { project } = useProject(projectId);
  const router = useRouter();
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
            <Button
              size="small"
              onClick={() =>
                router.push(`${project?.permalink}?taskId=${task.id}`)
              }
            >
              View
            </Button>
          </>
        ),
      });

      clearStoredValues();
    },
    [createTask, onDone, projectId, project, router, clearStoredValues]
  );
  return (
    <Modal
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
        onChange={setStoredValues}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
