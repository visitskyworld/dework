import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card } from "antd";
import { TaskCard } from "../card/TaskCard";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { Can, usePermissionFn } from "@dewo/app/contexts/PermissionsContext";
import { TaskSectionData } from "./util";
import {
  TaskBoardColumnEmpty,
  TaskBoardColumnEmptyProps,
} from "./TaskBoardColumnEmtpy";
import { TaskBoardColumnOptionButton } from "./TaskBoardColumnOptionButton";
import {
  List,
  CellMeasurerCache,
  CellMeasurer,
  AutoSizer,
} from "react-virtualized";
import { TaskBoardColumnSectionHeader } from "./TaskBoardColumnSectionHeader";
import {
  TaskViewGroupHeader,
  TaskViewGroupHeaderExtra,
} from "./TaskViewGroupHeader";
import {
  useRecalculateVirtualizedListRowHeight,
  VirtualizedListRow,
} from "../list/useRecalculateVirtualizedListRowHeight";

interface Props {
  status: TaskStatus;
  sections: TaskSectionData[];
  width: number;
  projectId?: string;
  currentlyDraggingTask?: Task;
  empty?: TaskBoardColumnEmptyProps;
}

export const TaskBoardColumn: FC<Props> = ({
  status,
  sections,
  width,
  projectId,
  currentlyDraggingTask,
  empty,
}) => {
  const cardBorderWidth = 2;
  const hasPermission = usePermissionFn();
  const count = useMemo(
    () => sections.reduce((count, section) => count + section.tasks.length, 0),
    [sections]
  );

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleCollapsed = useCallback(
    (id: string) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] })),
    []
  );

  const list = useRef<List>(null);
  const cache = useMemo(
    () => new CellMeasurerCache({ fixedWidth: true, defaultHeight: 120 }),
    []
  );

  const rows = useMemo<
    (VirtualizedListRow & { draggableId: string; isDragDisabled: boolean })[]
  >(
    () =>
      sections
        .map((section) => [
          {
            id: [status, section.id].join(":"),
            draggableId: [status, section.id].join(":"),
            isDragDisabled: true,
            render: () =>
              sections.length > 1 && (
                <TaskBoardColumnSectionHeader
                  title={`${section.title} (${section.tasks.length})`}
                  collapsed={collapsed[section.id]}
                  onChangeCollapsed={() => toggleCollapsed(section.id)}
                  section={section.section}
                  button={section.button}
                />
              ),
          },
          ...section.tasks.map((task) => ({
            id: JSON.stringify(task),
            draggableId: task.id,
            isDragDisabled: !hasPermission("update", task, `status[${status}]`),
            render: () =>
              !collapsed[section.id] && (
                <TaskCard
                  task={task}
                  style={{ marginLeft: 8, marginRight: 8, marginBottom: 8 }}
                />
              ),
          })),
        ])
        .flat(),
    [sections, collapsed, toggleCollapsed, hasPermission, status]
  );

  useRecalculateVirtualizedListRowHeight(cache, list, rows);

  return (
    <Card
      size="small"
      title={<TaskViewGroupHeader showIcon count={count} status={status} />}
      extra={
        <TaskViewGroupHeaderExtra
          status={status}
          projectId={projectId}
          extra={
            !!projectId &&
            status !== TaskStatus.DONE && (
              <Can I="create" this={{ __typename: "TaskSection", projectId }}>
                <TaskBoardColumnOptionButton
                  status={status}
                  projectId={projectId}
                />
              </Can>
            )
          }
        />
      }
      style={{ width }}
      bodyStyle={{ padding: 0 }}
      className="dewo-task-board-column"
    >
      <AutoSizer>
        {({ height }) => (
          <Droppable
            mode="virtual"
            droppableId={status}
            isDropDisabled={
              !currentlyDraggingTask ||
              (currentlyDraggingTask.status === TaskStatus.DONE &&
                status === TaskStatus.DONE) ||
              !hasPermission(
                "update",
                currentlyDraggingTask,
                `status[${status}]`
              )
            }
            renderClone={(provided, _snapshot, rubric) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {rows[rubric.source.index].render()}
              </div>
            )}
          >
            {(provided) => (
              <List
                height={height}
                width={width - cardBorderWidth}
                rowCount={!!count ? rows.length : 0}
                rowHeight={cache.rowHeight}
                style={{ paddingTop: 8, minHeight: height }}
                deferredMeasurementCache={cache}
                noRowsRenderer={
                  !count && !!empty
                    ? () => <TaskBoardColumnEmpty {...empty} />
                    : undefined
                }
                ref={(ref) => {
                  // @ts-expect-error
                  list.current = ref;
                  // react-virtualized has no way to get the list's ref that I can so
                  // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                  if (ref) {
                    // eslint-disable-next-line react/no-find-dom-node
                    const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                    if (whatHasMyLifeComeTo instanceof HTMLElement) {
                      provided.innerRef(whatHasMyLifeComeTo);
                    }
                  }
                }}
                rowRenderer={({ index, style, parent, columnIndex, key }) => (
                  <CellMeasurer
                    cache={cache}
                    columnIndex={columnIndex}
                    key={key}
                    parent={parent}
                    rowIndex={index}
                  >
                    <Draggable
                      key={rows[index].draggableId}
                      draggableId={rows[index].draggableId}
                      index={index}
                      isDragDisabled={rows[index]?.isDragDisabled}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            ...style,
                            width: width - cardBorderWidth,
                            cursor: rows[index]?.isDragDisabled
                              ? "pointer"
                              : "grab",
                          }}
                        >
                          {rows[index].render()}
                        </div>
                      )}
                    </Draggable>
                  </CellMeasurer>
                )}
              />
            )}
          </Droppable>
        )}
      </AutoSizer>
    </Card>
  );
};
