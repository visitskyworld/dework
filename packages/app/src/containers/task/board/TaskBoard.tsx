import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { Row, Space } from "antd";
import React, {
  FC,
  useEffect,
  useCallback,
  useState,
  useMemo,
  ReactNode,
} from "react";
import {
  DragDropContext,
  DragDropContextProps,
  DragStart,
  resetServerContext,
} from "react-beautiful-dnd";
import { getSortKeyBetween } from "./util";
import { TaskBoardColumn } from "./TaskBoardColumn";
import { useUpdateTask } from "../hooks";
import { TaskBoardColumnEmptyProps } from "./TaskBoardColumnEmtpy";
import { ContributorReviewModal } from "../ContributorReviewModal";
import { useToggle } from "@dewo/app/util/hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { useTaskViewGroups } from "../views/hooks";

interface Props {
  tasks: Task[];
  projectId?: string;
  footer?: Partial<Record<TaskStatus, ReactNode>>;
  empty?: Partial<Record<TaskStatus, TaskBoardColumnEmptyProps>>;
  statuses?: TaskStatus[];
}

const columnWidth = 330;

export const TaskBoard: FC<Props> = ({ tasks, projectId, footer, empty }) => {
  const { user } = useAuthContext();
  const hasPermission = usePermissionFn();

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
      const [status, sectionId] = result.destination.droppableId.split(":") as [
        TaskStatus,
        string
      ];

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

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

      const section = taskViewGroups
        .find((g) => g.value === status)
        ?.sections.find((s) => s.id === sectionId);

      const taskAbove = section?.tasks[indexExcludingItself - 1];
      const taskBelow = section?.tasks[indexExcludingItself];
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
          assigneeIds: shouldAssignCurrentUser ? [user.id] : undefined,
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

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    resetServerContext();
    setLoaded(true);
  }, []);

  resetServerContext();
  if (!loaded) return null;
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Row className="dewo-task-board">
          <Space size="middle" align="start">
            {taskViewGroups.map((group) => (
              <div key={group.value} style={{ width: columnWidth }}>
                <TaskBoardColumn
                  status={group.value as TaskStatus}
                  width={columnWidth}
                  sections={group.sections}
                  projectId={projectId}
                  currentlyDraggingTask={currentlyDraggingTask}
                  footer={footer?.[group.value as TaskStatus]}
                  empty={empty?.[group.value as TaskStatus]}
                />
              </div>
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
