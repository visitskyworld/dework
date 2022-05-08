import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { Row, Space } from "antd";
import React, { FC, useCallback, useState, useMemo } from "react";
import {
  DragDropContext,
  DragDropContextProps,
  DragStart,
} from "react-beautiful-dnd";
import { getSortKeyBetween } from "./util";
import { TaskBoardColumn } from "./TaskBoardColumn";
import { useUpdateTask } from "../hooks";
import { TaskBoardColumnEmptyProps } from "./TaskBoardColumnEmtpy";
import { ContributorReviewModal } from "../ContributorReviewModal";
import { useMounted, useToggle } from "@dewo/app/util/hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { useTaskViewGroups } from "../views/hooks";
import { SkeletonTaskBoard } from "./SkeletonTaskBoard";
import { useTaskViewContext } from "../views/TaskViewContext";

interface Props {
  tasks: Task[];
  userId?: string;
  empty?: Partial<Record<TaskStatus, TaskBoardColumnEmptyProps>>;
}

const columnWidth = 330;

export const TaskBoard: FC<Props> = ({ tasks, empty }) => {
  const { user } = useAuthContext();
  const hasPermission = usePermissionFn();
  const projectId = useTaskViewContext().currentView?.projectId ?? undefined;

  const taskViewGroups = useTaskViewGroups(tasks, projectId);

  const [currentDraggableId, setCurrentDraggableId] = useState<string>();
  const currentlyDraggingTask = useMemo(
    () => tasks.find((t) => t.id === currentDraggableId),
    [tasks, currentDraggableId]
  );

  const reviewModalToggle = useToggle();
  const [taskInReview, setTaskInReview] = useState<Task | undefined>(undefined);

  const updateTask = useUpdateTask();
  const handleDragStart = useCallback(
    (dragStart: DragStart) => setCurrentDraggableId(dragStart.draggableId),
    []
  );
  const handleDragEnd = useCallback<DragDropContextProps["onDragEnd"]>(
    async (result) => {
      setCurrentDraggableId(undefined);
      if (result.reason !== "DROP" || !result.destination) return;

      const taskId = result.draggableId;
      const status = result.destination.droppableId as TaskStatus;

      const taskViewGroup = taskViewGroups.find((g) => g.value === status);
      if (!taskViewGroup) return;

      const indexExcludingItself = (() => {
        const newIndex = result.destination.index;
        const oldIndex = result.source.index;
        // To get the cards above and below the currently dropped card
        // we need to offset the new index by 1 if the card was dragged
        // from above in the same lane. The card we're dragging from
        // above makes all other cards move up one step
        if (
          result.source.droppableId === result.destination.droppableId &&
          oldIndex < newIndex
        ) {
          return newIndex + 1;
        }

        return newIndex;
      })();

      let sectionIndex = 0;
      let sectionOffset = 1;
      while (
        sectionOffset + taskViewGroup.sections[sectionIndex].tasks.length <
        indexExcludingItself
      ) {
        sectionOffset += 1 + taskViewGroup.sections[sectionIndex].tasks.length;
        sectionIndex += 1;
      }

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const section = taskViewGroup.sections[sectionIndex];
      const indexInSection = indexExcludingItself - sectionOffset;

      const taskAbove = section?.tasks[indexInSection - 1];
      const taskBelow = section?.tasks[indexInSection];
      const sortKey = getSortKeyBetween(taskAbove, taskBelow, (t) => t.sortKey);

      const shouldAssignCurrentUser =
        !!user &&
        task.status === TaskStatus.TODO &&
        status === TaskStatus.IN_PROGRESS &&
        !task.assignees.length &&
        hasPermission("update", task, "assigneeIds");
      const updatedTask = await updateTask(
        {
          id: taskId,
          status,
          sortKey,
          assigneeIds: shouldAssignCurrentUser ? [user!.id] : undefined,
          sectionId: section?.section?.id ?? null,
        },
        task
      );

      if (
        status === TaskStatus.DONE &&
        task.owners.some((u) => u.id === user?.id)
      ) {
        reviewModalToggle.toggleOn();
        setTaskInReview(updatedTask);
      }
    },
    [tasks, taskViewGroups, updateTask, hasPermission, reviewModalToggle, user]
  );

  const mounted = useMounted();
  if (!mounted) return <SkeletonTaskBoard />;
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Row className="dewo-task-board">
          <Space size="middle" align="start">
            {taskViewGroups.map((group) => (
              <TaskBoardColumn
                key={group.value}
                status={group.value as TaskStatus}
                width={columnWidth}
                sections={group.sections}
                projectId={projectId}
                currentlyDraggingTask={currentlyDraggingTask}
                empty={empty?.[group.value as TaskStatus]}
              />
            ))}
          </Space>
        </Row>
        {!!taskInReview && (
          <ContributorReviewModal
            key={taskInReview.id}
            task={taskInReview}
            visible={reviewModalToggle.isOn}
            onCancel={reviewModalToggle.toggleOff}
            onDone={reviewModalToggle.toggleOff}
          />
        )}
      </DragDropContext>
    </>
  );
};
