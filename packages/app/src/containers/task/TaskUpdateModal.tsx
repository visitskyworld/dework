import _ from "lodash";
import { Modal, Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useMemo } from "react";
import {
  toTaskReward,
  toTaskRewardFormValues,
  useTask,
  useUpdateTask,
} from "./hooks";
import { TaskForm, TaskFormValues } from "./form/TaskForm";
import { TaskOptionsButton } from "./form/TaskOptionsButton";
import moment from "moment";
import { TaskApplyModal } from "./TaskApplyModal";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { TaskSeo } from "../seo/TaskSeo";

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
  const updateTask = useUpdateTask();
  const handleSubmit = useCallback(
    async ({ subtasks, ...values }: TaskFormValues) => {
      const reward = !!values.reward
        ? toTaskReward(values.reward)
        : values.reward;
      if (!reward && _.isEmpty(values)) return;
      await updateTask(
        {
          id: task!.id,
          ...values,
          reward,
          dueDate: values.dueDate?.toISOString(),
        },
        task!
      );
    },
    [updateTask, task]
  );

  const tagIds = useMemo(() => task?.tags.map((t) => t.id) ?? [], [task?.tags]);
  const initialValues = useMemo<TaskFormValues>(
    () => ({
      id: taskId,
      name: task?.name ?? "",
      description: task?.description ?? undefined,
      storyPoints: task?.storyPoints ?? undefined,
      tagIds,
      assigneeIds: task?.assignees.map((a) => a.id) ?? [],
      ownerId: task?.owner?.id,
      status: task?.status!,
      dueDate: !!task?.dueDate ? moment(task?.dueDate) : undefined,
      reward: toTaskRewardFormValues(task?.reward ?? undefined),
      options: _.omit(task?.options, "__typename"),
    }),
    [task, taskId, tagIds]
  );

  return (
    <>
      <Modal visible={visible} onCancel={onCancel} footer={null} width={768}>
        {!!task && <TaskOptionsButton task={task} />}
        <Skeleton loading={!task} active paragraph={{ rows: 5 }}>
          {!!task && (
            <TaskForm
              key={taskId}
              mode="update"
              task={task}
              projectId={task!.projectId}
              initialValues={initialValues}
              assignees={task!.assignees}
              showProjectLink={showProjectLink}
              onSubmit={handleSubmit}
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
  const isOnProjectPage = !!useParseIdFromSlug("projectSlug");

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
