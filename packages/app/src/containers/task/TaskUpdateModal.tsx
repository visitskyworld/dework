import _ from "lodash";
import { Modal, Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useMemo } from "react";
import {
  toTaskRewardFormValues,
  useTask,
  useTaskRoles,
  useUpdateTaskFromFormValues,
} from "./hooks";
import { TaskForm } from "./form/TaskForm";
import { TaskOptionsButton } from "./form/TaskOptionsButton";
import moment from "moment";
import { TaskApplyModal } from "./actions/apply/TaskApplyModal";
import { TaskSeo } from "../seo/TaskSeo";
import { TaskFormValues } from "./form/types";
import { getTaskGatingType } from "./form/util";

interface Props {
  taskId: string;
  visible: boolean;
  showProjectLink: boolean;
  onCancel(): void;
}

export const TaskUpdateModal: FC<Props> = ({
  taskId,
  visible,
  showProjectLink,
  onCancel,
}) => {
  const task = useTask(
    taskId,
    typeof window === "undefined" ? undefined : "network-only"
  );

  const updateTaskFromFormValues = useUpdateTaskFromFormValues(task);

  const taskRoles = useTaskRoles(task);
  const tagIds = useMemo(() => task?.tags.map((t) => t.id) ?? [], [task?.tags]);
  const initialValues = useMemo<TaskFormValues>(
    (): TaskFormValues => ({
      projectId: task?.projectId!,
      name: task?.name ?? "",
      description: task?.description ?? undefined,
      storyPoints: task?.storyPoints ?? undefined,
      tagIds,
      assigneeIds: task?.assignees.map((a) => a.id) ?? [],
      ownerId: task?.owner?.id,
      status: task?.status!,
      dueDate: !!task?.dueDate ? moment(task?.dueDate) : undefined,
      reward: toTaskRewardFormValues(task?.reward ?? undefined),
      gating: {
        roleIds: taskRoles?.map((r) => r.id) ?? [],
        type: !!task
          ? getTaskGatingType(
              task,
              taskRoles?.map((r) => r.id)
            )
          : undefined,
      },
    }),
    [task, tagIds, taskRoles]
  );

  return (
    <>
      <Modal visible={visible} onCancel={onCancel} footer={null} width={960}>
        {!!task && <TaskOptionsButton task={task} />}
        <Skeleton loading={!task || !taskRoles} active paragraph={{ rows: 5 }}>
          {!!task && taskRoles && (
            <TaskForm
              key={taskId}
              mode="update"
              task={task}
              projectId={task!.projectId}
              initialValues={initialValues}
              assignees={task!.assignees}
              showProjectLink={showProjectLink}
              onSubmit={updateTaskFromFormValues}
            />
          )}
        </Skeleton>
      </Modal>
      {visible && !!task && <TaskSeo task={task} />}
    </>
  );
};

export const TaskUpdateModalListener: FC = () => {
  const router = useRouter();
  const taskId = router.query.taskId as string | undefined;
  const applyToTaskId = router.query.applyToTaskId as string | undefined;
  const isOnProjectPage = !!router.query.projectSlug;

  const closeModal = useCallback(
    () =>
      router.push({
        pathname: router.pathname,
        query: _.omit(router.query, ["taskId", "applyToTaskId"]),
      }),
    [router]
  );
  return (
    <>
      <TaskUpdateModal
        taskId={taskId!}
        visible={!!taskId}
        onCancel={closeModal}
        showProjectLink={!isOnProjectPage}
      />
      <TaskApplyModal
        taskId={applyToTaskId}
        visible={!!applyToTaskId}
        onCancel={closeModal}
        onDone={closeModal}
      />
    </>
  );
};
