import { Grid, Table, TablePaginationConfig } from "antd";
import React, {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SearchTasksInput, Task } from "@dewo/app/graphql/types";
import { TaskListItem } from "../../task/list/TaskListItem";

import { TaskCard } from "../card/TaskCard";
import classNames from "classnames";
import styles from "./TaskList.module.less";
import { usePaginatedTasks } from "../hooks";
import _ from "lodash";
import { SkeletonTaskListItem } from "./SkeletonTaskListItem";

interface Props {
  query: SearchTasksInput;
  showHeaders?: boolean;
  style?: CSSProperties;
  className?: string;
  shouldRenderTask?(task: Task): boolean;
}

export const TaskTable: FC<Props> = ({
  query,
  showHeaders = true,
  style,
  className,
  shouldRenderTask,
}) => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const paginated = usePaginatedTasks(query);

  const isLastTaskLoaded = useMemo(() => {
    if (!pagination?.current || !pagination?.pageSize) return true;
    const lastTaskIndex = pagination.current * pagination.pageSize - 1;
    return !!paginated.tasks?.[lastTaskIndex];
  }, [pagination, paginated.tasks]);
  useEffect(() => {
    if (!paginated.loading && !isLastTaskLoaded) {
      paginated.fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginated.loading, isLastTaskLoaded]);

  const screen = Grid.useBreakpoint();

  const tasks = useMemo(
    () =>
      !!shouldRenderTask
        ? paginated.tasks?.filter(shouldRenderTask)
        : paginated.tasks,
    [paginated.tasks, shouldRenderTask]
  );
  const rows = useMemo<(() => ReactNode)[]>(
    () =>
      _.range((paginated.hasMore ? paginated.total : tasks?.length) ?? 0)
        .map((index) => tasks?.[index])
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
    [tasks, paginated.hasMore, paginated.total, screen.lg]
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
