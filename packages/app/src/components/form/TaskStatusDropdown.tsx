import { Row, Tooltip } from "antd";
import React, { FC } from "react";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { TaskStatusIcon } from "@dewo/app/components/icons/task/TaskStatus";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { STATUS_LABEL } from "../../containers/task/board/util";

const statuses = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];
interface Props {
  task: Task;
  onChange?(status: TaskStatus): void;
}

export const TaskStatusDropdown: FC<Props> = ({ task, onChange }) => {
  const canChange = usePermission("update", task, "status");
  return (
    <DropdownSelect
      value={task.status}
      mode="default"
      disabled={!canChange}
      onChange={onChange}
      options={statuses.map((status) => ({
        value: status,
        label: (
          <Row align="middle" style={{ gap: 8 }}>
            <TaskStatusIcon status={status} />
            {STATUS_LABEL[status]}
          </Row>
        ),
      }))}
      children={
        <Tooltip title={STATUS_LABEL[task.status]} placement="left">
          <div style={{ display: "grid", placeItems: "center", width: 24 }}>
            <TaskStatusIcon status={task.status} />
          </div>
        </Tooltip>
      }
    />
  );
};
