import { Grid, Table, TablePaginationConfig } from "antd";
import React, {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Task } from "@dewo/app/graphql/types";
import { TaskListItem } from "../../task/list/TaskListItem";

import { TaskCard } from "../card/TaskCard";
import classNames from "classnames";
import styles from "./TaskList.module.less";
import _ from "lodash";
import { SkeletonTaskListItem } from "./SkeletonTaskListItem";
import { TaskViewLayoutData } from "../views/hooks";

interface Props {
  data: TaskViewLayoutData;
  showHeaders?: boolean;
  style?: CSSProperties;
  className?: string;
  shouldRenderTask?(task: Task): boolean;
}

export const TaskTable: FC<Props> = ({
  data,
  showHeaders = true,
  style,
  className,
  shouldRenderTask,
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

  const tasks = useMemo(
    () =>
      !!shouldRenderTask ? data.tasks?.filter(shouldRenderTask) : data.tasks,
    [data.tasks, shouldRenderTask]
  );
  const rows = useMemo<(() => ReactNode)[]>(
    () =>
      _.range((data.hasMore ? data.total : tasks?.length) ?? 0)
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
    [tasks, data.hasMore, data.total, screen.lg]
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
