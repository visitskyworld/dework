import { Grid, Row, Table } from "antd";
import React, {
  CSSProperties,
  FC,
  MutableRefObject,
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
import { useTaskViewGroups } from "../views/hooks";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { usePrevious } from "@dewo/app/util/hooks";
import { TaskCard } from "../card/TaskCard";
import classNames from "classnames";
import styles from "./TaskList.module.less";

interface Props {
  tasks: Task[];
  mode?: "table" | "virtualized";
  showHeaders?: boolean;
  projectId?: string;
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
  tasks,
  projectId,
  showHeaders = true,
  style,
  className,
  mode = "virtualized",
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const taskViewGroups = useTaskViewGroups(tasks, projectId);

  const list = useRef<List>(null);
  const cache = useMemo(
    () => new CellMeasurerCache({ fixedWidth: true, defaultHeight: 36 }),
    []
  );

  const screen = Grid.useBreakpoint();
  useRecalculateTaskCardHeight(
    cache,
    list,
    collapsed,
    taskViewGroups,
    screen.sm
  );

  const rows = useMemo<(() => ReactNode)[]>(
    () =>
      taskViewGroups
        .map((taskViewGroup) => [
          () =>
            !!showHeaders ? (
              <Row style={{ padding: 12 }}>
                <TaskViewGroupHeader
                  showIcon
                  count={taskViewGroup.sections.reduce(
                    (count, section) => count + section.tasks.length,
                    0
                  )}
                  status={taskViewGroup.value as TaskStatus}
                  collapse={{
                    collapsed: !!collapsed[taskViewGroup.value],
                    onToggle: (collapsed) =>
                      setCollapsed((prev) => ({
                        ...prev,
                        [taskViewGroup.value]: collapsed,
                      })),
                  }}
                />
                <TaskViewGroupHeaderExtra
                  status={taskViewGroup.value as TaskStatus}
                  projectId={projectId}
                />
              </Row>
            ) : null,
          ...taskViewGroup.sections
            .map((section) =>
              section.tasks.map(
                (task) => () =>
                  !collapsed[taskViewGroup.value] ? (
                    screen.sm ? (
                      <TaskListItem key={task.id} task={task} />
                    ) : (
                      <TaskCard task={task} style={{ marginBottom: 8 }} />
                    )
                  ) : null
              )
            )
            .flat(),
        ])
        .flat(),
    [taskViewGroups, collapsed, projectId, showHeaders, screen.sm]
  );

  if (mode === "table") {
    return (
      <Table
        dataSource={rows}
        bordered={false}
        size="small"
        style={style}
        className={classNames({
          [className ?? ""]: true,
          [styles.table]: true,
        })}
        showHeader={showHeaders}
        pagination={{ hideOnSinglePage: true }}
        columns={[{ key: "column", render: (_, row) => row() }]}
      />
    );
  }

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
