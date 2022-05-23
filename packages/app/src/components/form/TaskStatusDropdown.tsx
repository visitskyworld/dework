import { Row, Tooltip } from "antd";
import React, { FC } from "react";
import { TaskStatus } from "@dewo/app/graphql/types";
import { TaskStatusIcon } from "@dewo/app/components/icons/task/TaskStatus";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import { STATUS_LABEL } from "../../containers/task/board/util";

const statuses = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];
interface Props {
  status?: TaskStatus;
  disabled: boolean;
  onChange?(status: TaskStatus): void;
}

export const TaskStatusDropdown: FC<Props> = ({
  status = TaskStatus.TODO,
  disabled,
  onChange,
}) => (
  <DropdownSelect
    value={status}
    mode="default"
    disabled={disabled}
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
      <Tooltip title={STATUS_LABEL[status]} placement="left">
        <div style={{ display: "grid", placeItems: "center", width: 24 }}>
          <TaskStatusIcon status={status} />
        </div>
      </Tooltip>
    }
  />
);
