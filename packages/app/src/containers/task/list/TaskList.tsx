import { Button, Grid, Row, Skeleton } from "antd";
import React, { CSSProperties, FC, useMemo, useRef, useState } from "react";
import { TaskStatus } from "@dewo/app/graphql/types";
import { TaskListItem } from "../../task/list/TaskListItem";
import {
  TaskViewGroupHeader,
  TaskViewGroupHeaderExtra,
} from "../../task/board/TaskViewGroupHeader";
import { useTaskViewLayoutData, useTaskViewLayoutItems } from "../views/hooks";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { TaskCard } from "../card/TaskCard";
import { useTaskViewContext } from "../views/TaskViewContext";
import {
  useRecalculateVirtualizedListRowHeight,
  VirtualizedListRow,
} from "./useRecalculateVirtualizedListRowHeight";

interface Props {
  showHeaders?: boolean;
  style?: CSSProperties;
  className?: string;
}

export const TaskList: FC<Props> = ({
  showHeaders = true,
  style,
  className,
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const items = useTaskViewLayoutItems();
  const queries = useMemo(() => items.map((i) => i.query), [items]);
  const data = useTaskViewLayoutData(queries);
  const projectId = useTaskViewContext().currentView?.projectId ?? undefined;

  const list = useRef<List>(null);
  const cache = useMemo(
    () => new CellMeasurerCache({ fixedWidth: true, defaultHeight: 59 }),
    []
  );

  const screen = Grid.useBreakpoint();
  const rows = useMemo<VirtualizedListRow[]>(
    () =>
      data
        .map((d, index) => {
          const status = items[index].value as TaskStatus;
          return [
            {
              id: `header:${status}`,
              hidden: !showHeaders,
              render: () => (
                <Row style={{ padding: 12 }}>
                  <TaskViewGroupHeader
                    showIcon
                    count={d.total ?? 0}
                    status={status}
                    collapse={{
                      collapsed: !!collapsed[status],
                      onToggle: (collapsed) =>
                        setCollapsed((p) => ({ ...p, [status]: collapsed })),
                    }}
                  />
                  <TaskViewGroupHeaderExtra
                    status={status}
                    projectId={projectId}
                  />
                </Row>
              ),
            },
            ...(d.tasks ?? []).map((task) => ({
              id: task.id,
              hidden: !!collapsed[status],
              render: () =>
                screen.sm ? (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    tags={{
                      skills: true,
                      tags: true,
                      properties: true,
                      reward: true,
                    }}
                  />
                ) : (
                  <TaskCard
                    task={task}
                    style={{ marginBottom: 8 }}
                    tags={{ skills: true, tags: true, properties: true }}
                  />
                ),
            })),
            {
              id: `load-more:${status}`,
              hidden: !!collapsed[status] || !d.hasMore || !d.tasks,
              render: () => (
                <Button block type="text" onClick={d.fetchMore}>
                  Load more
                </Button>
              ),
            },
            {
              id: `loading:${status}`,
              hidden: !d.loading,
              render: () => <Skeleton />,
            },
          ];
        })
        .flat()
        .filter((r) => !r.hidden),
    [data, collapsed, items, projectId, showHeaders, screen.sm]
  );

  useRecalculateVirtualizedListRowHeight(cache, list, rows);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          width={width}
          rowCount={rows.length}
          rowHeight={cache.rowHeight}
          style={style}
          className={className}
          deferredMeasurementCache={cache}
          ref={(ref) => {
            // @ts-expect-error
            list.current = ref;
          }}
          rowRenderer={({ index, style, parent, columnIndex, key }) => (
            <CellMeasurer
              cache={cache}
              columnIndex={columnIndex}
              key={key}
              parent={parent}
              rowIndex={index}
            >
              <div style={style}>{rows[index].render()}</div>
            </CellMeasurer>
          )}
        />
      )}
    </AutoSizer>
  );
};
