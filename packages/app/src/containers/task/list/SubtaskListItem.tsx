import { useNavigateToTask } from "@dewo/app/util/navigation";
import { Divider, Row, Typography } from "antd";
import React, { FC } from "react";
import { TaskStatusIcon } from "@dewo/app/components/icons/task/TaskStatus";
import { usePrefetchTaskDetailsOnHover } from "../card/usePrefetchTaskDetailsOnHover";
import { TaskTree } from "@dewo/app/components/icons/task/TaskTree";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { Subtask } from "@dewo/app/graphql/types";

interface Props {
  task: Subtask;
  last: boolean;
  showBranches?: boolean;
}

export const SubtaskListItem: FC<Props> = ({ task, last, showBranches }) => {
  const navigateToTask = useNavigateToTask(task.id);
  const prefetchTaskDetailsOnHover = usePrefetchTaskDetailsOnHover(task.id);

  return (
    <div onClick={stopPropagation} {...prefetchTaskDetailsOnHover}>
      <Row
        align="middle"
        style={{
          columnGap: 8,
          minHeight: 32,
          paddingBottom: !showBranches ? 4 : 0,
          paddingTop: !showBranches ? 4 : 0,
        }}
        onClick={navigateToTask}
      >
        {!!showBranches && <TaskTree last={last} />}
        <TaskStatusIcon status={task.status} />
        <Typography.Text style={{ flex: 1 }}>{task.name}</Typography.Text>
      </Row>
      {!showBranches && !last && <Divider style={{ margin: 0 }} />}
    </div>
  );
};
