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
import { NotFoundResourceModal } from "@dewo/app/components/NotFoundResourceModal";
import { ForbiddenResourceModal } from "@dewo/app/components/ForbiddenResourceModal";
import { useWindowFocus } from "@dewo/app/util/hooks";

interface Props {
  taskId: string;
  visible: boolean;
  onCancel(): void;
}

const TaskUpdateModalContent: FC<{ taskId: string }> = ({ taskId }) => {
  const router = useRouter();
  const isOnProjectPage = !!router.query.projectSlug;
  const { task } = useTask(taskId);
  const updateTaskFromFormValues = useUpdateTaskFromFormValues(task);
  const taskRoles = useTaskRoles(task);
  const formValues = useMemo(
    (): TaskFormValues | undefined =>
      !!task && !!taskRoles ? toTaskFormValues(task, taskRoles) : undefined,
    [task, taskRoles]
  );

  return (
    <Skeleton loading={!formValues} active paragraph={{ rows: 5 }}>
      {!!task && (
        <TaskForm
          key={taskId}
          mode="update"
          task={task}
          projectId={task!.projectId}
          initialValues={formValues}
          showProjectLink={!isOnProjectPage}
          onSubmit={updateTaskFromFormValues}
        />
      )}
    </Skeleton>
  );
};

export const TaskUpdateModal: FC<Props> = ({ taskId, visible, onCancel }) => {
  const router = useRouter();
  const isOnProjectPage = !!router.query.projectSlug;
  const { task, error, refetch } = useTask(
    taskId,
    isSSR ? undefined : "cache-and-network"
  );
  useWindowFocus(refetch);

  const forbiddenError = !!error?.graphQLErrors.some(
    (e) => e.extensions?.response?.statusCode === 403
  );
  const notFoundError = !!error?.graphQLErrors.some(
    (e) => e.extensions?.response?.statusCode === 404
  );
  return (
    <>
      <Modal
        visible={visible && !forbiddenError && !notFoundError}
        onCancel={onCancel}
        footer={null}
        width={1000}
      >
        {!!task && <TaskOptionsButton task={task} />}
        <TaskUpdateModalContent key={taskId} taskId={taskId} />
      </Modal>
      {visible && !!task && <TaskSeo task={task} />}
      <NotFoundResourceModal
        visible={visible && notFoundError}
        message="This task does not exist or has been deleted."
        onClose={onCancel}
      />
      <ForbiddenResourceModal
        visible={visible && forbiddenError && !isOnProjectPage}
      />
    </>
  );
};

export const TaskUpdateModalListener: FC = () => {
  const router = useRouter();
  const taskId = router.query.taskId as string | undefined;
  const applyToTaskId = router.query.applyToTaskId as string | undefined;

  const closeTaskModal = useCallback(() => {
    return router.push({
      pathname: router.pathname,
      query: _.omit(router.query, ["taskId", "applyToTaskId"]),
    });
  }, [router]);

  const closeApplyTaskModal = useCallback(() => {
    return router.push({
      pathname: router.pathname,
      query: _.omit(router.query, ["applyToTaskId"]),
    });
  }, [router]);

  return (
    <>
      <TaskUpdateModal
        taskId={taskId!}
        visible={!!taskId}
        onCancel={closeTaskModal}
      />
      <TaskApplyModal
        taskId={applyToTaskId}
        visible={!!applyToTaskId}
        onCancel={closeApplyTaskModal}
        onDone={closeApplyTaskModal}
      />
    </>
  );
};
