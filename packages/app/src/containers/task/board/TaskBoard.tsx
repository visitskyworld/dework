import { Task, TaskSection, TaskStatus } from "@dewo/app/graphql/types";
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
import { getSortKeyBetween, TaskGroup, useGroupedTasks } from "./util";
import { TaskBoardColumn } from "./TaskBoardColumn";
import { useUpdateTask } from "../hooks";
import { TaskBoardColumnEmptyProps } from "./TaskBoardColumnEmtpy";
import { ContributorReviewModal } from "../ContributorReviewModal";
import { useToggle } from "@dewo/app/util/hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useFilteredTasks } from "./filters/FilterContext";
import { useProject } from "../../project/hooks";

const defaultStatuses: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

interface Props {
  tasks: Task[];
  sections?: TaskSection[];
  projectId?: string;
  footer?: Partial<Record<TaskStatus, ReactNode>>;
  empty?: Partial<Record<TaskStatus, TaskBoardColumnEmptyProps>>;
  statuses?: TaskStatus[];
}

const columnWidth = 330;
const emptyGroups: TaskGroup[] = [{ id: "default", title: "", tasks: [] }];

export const TaskBoard: FC<Props> = ({
  tasks,
  sections,
  projectId,
  footer,
  empty,
  statuses = defaultStatuses,
}) => {
  const { user } = useAuthContext();

  const { project } = useProject(projectId);
  const filteredTasks = useFilteredTasks(tasks, project?.organizationId);
  const groupedTasks = useGroupedTasks(filteredTasks, projectId, sections);

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
      const [status, groupId] = result.destination.droppableId.split(":") as [
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

      const group = groupedTasks[status]?.find((group) => group.id === groupId);
      const taskAbove = group?.tasks[indexExcludingItself - 1];
      const taskBelow = group?.tasks[indexExcludingItself];
      const sortKey = getSortKeyBetween(taskAbove, taskBelow, (t) => t.sortKey);

      const updatedTask = await updateTask(
        { id: taskId, status, sortKey, sectionId: group?.section?.id ?? null },
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
    [tasks, groupedTasks, updateTask, reviewModalToggle, user]
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
            {statuses.map((status) => (
              <div key={status} style={{ width: columnWidth }}>
                <TaskBoardColumn
                  status={status}
                  width={columnWidth}
                  groups={groupedTasks[status] ?? emptyGroups}
                  projectId={projectId}
                  currentlyDraggingTask={currentlyDraggingTask}
                  footer={footer?.[status]}
                  empty={empty?.[status]}
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
