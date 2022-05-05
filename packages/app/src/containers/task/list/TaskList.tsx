import { Button, Grid, Row, Skeleton } from "antd";
import React, {
  CSSProperties,
  FC,
  MutableRefObject,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { usePrevious } from "@dewo/app/util/hooks";
import { TaskCard } from "../card/TaskCard";
import { useTaskViewContext } from "../views/TaskViewContext";

interface Props {
  showHeaders?: boolean;
  style?: CSSProperties;
  className?: string;
}

function useRecalculateTaskCardHeight(
  cache: CellMeasurerCache,
  list: MutableRefObject<List | null>,
  ...deps: any[]
) {
  const prevDeps = deps.map(usePrevious);
  const changed = !deps.every((dep, index) => prevDeps[index] === dep);
  if (changed) {
    cache.clearAll();
    list.current?.recomputeRowHeights();
  }
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
  useRecalculateTaskCardHeight(cache, list, collapsed, data, screen.sm);

  const rows = useMemo<(() => ReactNode)[]>(
    () =>
      data
        .map((d, index) => {
          const status = items[index].value as TaskStatus;
          return [
            () =>
              !!showHeaders ? (
                <Row style={{ padding: 12 }}>
                  <TaskViewGroupHeader
                    showIcon
                    count={d.total ?? 0}
                    status={status}
                    collapse={{
                      collapsed: !!collapsed[status],
                      onToggle: (collapsed) =>
                        setCollapsed((prev) => ({
                          ...prev,
                          [status]: collapsed,
                        })),
                    }}
                  />
                  <TaskViewGroupHeaderExtra
                    status={status}
                    projectId={projectId}
                  />
                </Row>
              ) : null,
            ...(d.tasks ?? []).map(
              (task) => () =>
                !collapsed[status] ? (
                  screen.sm ? (
                    <TaskListItem key={task.id} task={task} />
                  ) : (
                    <TaskCard task={task} style={{ marginBottom: 8 }} />
                  )
                ) : null
            ),
            ...(!collapsed[status] && d.hasMore && !!d.tasks
              ? [
                  () => (
                    <Button block type="text" onClick={d.fetchMore}>
                      Load more
                    </Button>
                  ),
                ]
              : []),
            ...(d.loading ? [() => <Skeleton />] : []),
          ];
        })
        .flat(),
    [data, collapsed, projectId, showHeaders, screen.sm, items]
  );

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
              <div style={style}>{rows[index]()}</div>
            </CellMeasurer>
          )}
        />
      )}
    </AutoSizer>
  );
};
