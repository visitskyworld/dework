import { Grid, Table, TablePaginationConfig } from "antd";
import React, {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TaskCard } from "../card/TaskCard";
import classNames from "classnames";
import styles from "./TaskList.module.less";
import _ from "lodash";
import { SkeletonTaskListItem } from "./SkeletonTaskListItem";
import { TaskViewLayoutData } from "../views/hooks";
import { TaskListItem } from "./TaskListItem";

interface Props {
  data: TaskViewLayoutData;
  showHeaders?: boolean;
  style?: CSSProperties;
  className?: string;
}

export const TaskTable: FC<Props> = ({
  data,
  showHeaders = true,
  style,
  className,
}) => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const isLastTaskLoaded = useMemo(() => {
    if (!pagination?.current || !pagination?.pageSize) return true;
    const lastTaskIndex = pagination.current * pagination.pageSize - 1;
    return !!data.tasks?.[lastTaskIndex];
  }, [pagination, data.tasks]);
  useEffect(() => {
    if (!data.loading && !isLastTaskLoaded) {
      data.fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.loading, isLastTaskLoaded]);

  const screen = Grid.useBreakpoint();
  const rows = useMemo<(() => ReactNode)[]>(
    () =>
      _.range((data.hasMore ? data.total : data.tasks?.length) ?? 0)
        .map((index) => data.tasks?.[index])
        .map(
          (task) => () =>
            !!task ? (
              screen.lg ? (
                <TaskListItem key={task.id} task={task} />
              ) : (
                <TaskCard task={task} style={{ marginBottom: 8 }} />
              )
            ) : (
              <SkeletonTaskListItem />
            )
        ),
    [data.tasks, data.hasMore, data.total, screen.lg]
  );

  return (
    <Table
      dataSource={rows}
      onChange={setPagination}
      bordered={false}
      size="small"
      style={style}
      className={classNames({ [className ?? ""]: true, [styles.table]: true })}
      showHeader={showHeaders}
      pagination={{ hideOnSinglePage: true }}
      columns={[{ key: "column", render: (_, row) => row() }]}
    />
  );
};
