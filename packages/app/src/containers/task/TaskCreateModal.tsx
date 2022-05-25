import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Task, TaskViewFilterType } from "@dewo/app/graphql/types";
import { Button, message, Modal, Typography } from "antd";
import React, { FC, useMemo, useCallback } from "react";
import { useCreateTaskFromFormValues } from "./hooks";
import { TaskForm } from "./form/TaskForm";
import { AtLeast } from "@dewo/app/types/general";
import { TaskFormValues } from "./form/types";
import { useRouter } from "next/router";
import { useProject } from "../project/hooks";
import moment from "moment";
import { useTaskViewContext } from "./views/TaskViewContext";
import { LocalStorage } from "@dewo/app/util/LocalStorage";

const buildKey = (initialValues: Partial<TaskFormValues>) =>
  `TaskCreateModal.v2.storedValues(${JSON.stringify(
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
  const { currentView } = useTaskViewContext();

  const storedValuesKey = useMemo(
    () => buildKey(initialValues),
    [initialValues]
  );
  const storedValues = useMemo(() => {
    try {
      const storedValuesString = LocalStorage.getItem(storedValuesKey);
      if (!storedValuesString) return undefined;
      return JSON.parse(storedValuesString);
    } catch {
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedValuesKey, visible]);
  const clearStoredValues = useCallback(
    () => LocalStorage.removeItem(storedValuesKey),
    [storedValuesKey]
  );
  const setStoredValues = useCallback(
    (values: Partial<TaskFormValues>) =>
      LocalStorage.setItem(storedValuesKey, JSON.stringify(values)),
    [storedValuesKey]
  );

  const canCreateTaskOwner = usePermission("create", {
    __typename: "Task",
    projectId,
    status: initialValues.status,
    owners: !!user ? [user] : [],
  });

  const taskGatingDefault = useMemo(
    () => user?.taskGatingDefaults.find((d) => d.projectId === projectId),
    [projectId, user?.taskGatingDefaults]
  );

  const viewValues = useMemo(() => {
    const filter = (type: TaskViewFilterType) =>
      currentView?.filters.find((filter) => filter.type === type);

    const priority = filter(TaskViewFilterType.PRIORITIES)?.priorities?.[0];
    const tagIds = filter(TaskViewFilterType.TAGS)?.tagIds;
    const assigneeIds = filter(
      TaskViewFilterType.ASSIGNEES
    )?.assigneeIds?.filter((id): id is string => !!id);
    const roleIds =
      filter(TaskViewFilterType.ROLES)?.roleIds ??
      taskGatingDefault?.roles.map((r) => r.id);
    const skillIds = filter(TaskViewFilterType.SKILLS)?.skillIds;
    const ownerIds = (() => {
      if (!canCreateTaskOwner) return [];
      const ids = filter(TaskViewFilterType.OWNERS)?.ownerIds;
      if (!!ids) return ids;
      if (!!user) return [user.id];
      return [];
    })();

    return { tagIds, priority, assigneeIds, roleIds, ownerIds, skillIds };
  }, [
    currentView?.filters,
    taskGatingDefault?.roles,
    canCreateTaskOwner,
    user,
  ]);

  const extendedInitialValues = useMemo<Partial<TaskFormValues>>(() => {
    return {
      gating: taskGatingDefault?.type,
      ...storedValues,
      dueDate: !!storedValues?.dueDate
        ? moment(storedValues.dueDate)
        : undefined,
      ...initialValues,
      ...viewValues,
    };
  }, [taskGatingDefault?.type, storedValues, initialValues, viewValues]);

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
      width={1000}
    >
      <TaskForm
        mode="create"
        projectId={projectId}
        initialValues={extendedInitialValues}
        onChange={setStoredValues}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};
