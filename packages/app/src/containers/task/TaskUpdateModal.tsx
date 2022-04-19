import _ from "lodash";
import { Modal, Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useMemo } from "react";
import { useTask, useTaskRoles, useUpdateTaskFromFormValues } from "./hooks";
import { TaskForm } from "./form/TaskForm";
import { TaskOptionsButton } from "./form/TaskOptionsButton";
import { TaskApplyModal } from "./actions/apply/TaskApplyModal";
import { TaskSeo } from "../seo/TaskSeo";
import { TaskFormValues } from "./form/types";
import { isSSR } from "@dewo/app/util/isSSR";
import { toTaskFormValues } from "./form/util";

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
  const task = useTask(taskId, isSSR ? undefined : "cache-and-network");

  const updateTaskFromFormValues = useUpdateTaskFromFormValues(task);

  const taskRoles = useTaskRoles(task);
  const initialValues = useMemo(
    (): TaskFormValues | undefined =>
      !!task && !!taskRoles ? toTaskFormValues(task, taskRoles) : undefined,
    [task, taskRoles]
  );

  return (
    <>
      <Modal visible={visible} onCancel={onCancel} footer={null} width={960}>
        {!!task && <TaskOptionsButton task={task} />}
        <Skeleton loading={!task || !taskRoles} active paragraph={{ rows: 5 }}>
          {!!initialValues && (
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
