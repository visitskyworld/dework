import { Button, Grid, Row, Skeleton } from "antd";
import React, {
  CSSProperties,
  FC,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { TaskListItem } from "../../task/list/TaskListItem";
import {
  TaskViewGroupHeader,
  TaskViewGroupHeaderExtra,
} from "../../task/board/TaskViewGroupHeader";
import {
  TaskViewLayoutData,
  useTaskViewLayoutData,
  useTaskViewLayoutItems,
} from "../views/hooks";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { useTaskViewContext } from "../views/TaskViewContext";
import {
  useRecalculateVirtualizedListRowHeight,
  VirtualizedListRow,
} from "./useRecalculateVirtualizedListRowHeight";
import { TaskCard } from "../card/TaskCard";

interface Props {
  showHeaders?: boolean;
  style?: CSSProperties;
  className?: string;
  data: TaskViewLayoutData[];
  renderTaskExtra?(task: Task): ReactNode;
}

export const TaskListFromView: FC<Omit<Props, "data">> = (props) => {
  const items = useTaskViewLayoutItems();
  const queries = useMemo(() => items.map((i) => i.query), [items]);
  const data = useTaskViewLayoutData(queries);

  return <TaskList {...props} data={data} />;
};

export const TaskList: FC<Props> = ({
  showHeaders = true,
  style,
  className,
  data,
  renderTaskExtra,
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const projectId = useTaskViewContext().currentView?.projectId ?? undefined;

  const list = useRef<List>(null);
  const cache = useMemo(
    () => new CellMeasurerCache({ fixedWidth: true, defaultHeight: 59 }),
    []
  );

  const recalculateRowHeight = useRef<(id: string) => void>();

  const screen = Grid.useBreakpoint();
  const rows = useMemo<VirtualizedListRow[]>(
    () =>
      data
        .map((d) => {
          const status = d.filter.statuses?.[0] as TaskStatus;
          return [
            {
              key: `header:${status}`,
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
              key: JSON.stringify(task),
              hidden: !!collapsed[status],
              render: () =>
                screen.lg ? (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    extra={renderTaskExtra?.(task)}
                    recalculateRowHeight={() =>
                      recalculateRowHeight.current?.(task.id)
                    }
                  />
                ) : (
                  <TaskCard
                    task={task}
                    style={{ marginBottom: 8 }}
                    recalculateRowHeight={() =>
                      recalculateRowHeight.current?.(task.id)
                    }
                  />
                ),
            })),
            {
              key: `load-more:${status}`,
              hidden: !!collapsed[status] || !d.hasMore || !d.tasks,
              render: () => (
                <Button block type="text" onClick={d.fetchMore}>
                  Load more
                </Button>
              ),
            },
            {
              key: `loading:${status}`,
              hidden: !d.loading,
              render: () => <Skeleton />,
            },
          ];
        })
        .flat()
        .filter((r) => !r.hidden),
    [data, collapsed, projectId, showHeaders, renderTaskExtra, screen.lg]
  );

  const fns = useRecalculateVirtualizedListRowHeight(cache, list, rows);
  recalculateRowHeight.current = fns.recalculateRowHeight;

  return (
    <AutoSizer>
      {({ height, width }) =>
        !!width &&
        !!height && (
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
        )
      }
    </AutoSizer>
  );
};
