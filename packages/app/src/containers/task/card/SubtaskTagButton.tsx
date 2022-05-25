import {
  CaretDownFilled,
  CaretUpFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import { Subtask, TaskStatus } from "@dewo/app/graphql/types";
import { Progress, Tag } from "antd";
import * as Colors from "@ant-design/colors";
import React, { FC, MouseEventHandler, useCallback, useMemo } from "react";
import { stopPropagation } from "@dewo/app/util/eatClick";

interface Props {
  subtasks: Subtask[];
  expanded?: boolean;
  onToggle?(): void;
}

export const SubtaskTagButton: FC<Props> = ({
  expanded,
  subtasks,
  onToggle,
}) => {
  const Icon = expanded ? CaretUpFilled : CaretDownFilled;
  const doneSubtasks = useMemo(
    () => subtasks.filter((t) => t.status === TaskStatus.DONE),
    [subtasks]
  );
  const handleClick = useCallback<MouseEventHandler<HTMLSpanElement>>(
    (e) => {
      stopPropagation(e);
      onToggle?.();
    },
    [onToggle]
  );
  return (
    <Tag onClick={handleClick} style={{ cursor: "pointer" }}>
      {doneSubtasks.length === subtasks.length ? (
        <CheckCircleFilled style={{ color: Colors.green.primary }} />
      ) : (
        <Progress
          type="circle"
          strokeWidth={12}
          percent={(doneSubtasks.length / subtasks.length) * 100}
          showInfo={false}
          width={14}
          style={{ marginRight: 5, marginTop: -2 }}
        />
      )}
      <span>
        {doneSubtasks.length}/{subtasks.length}
      </span>
      {!!onToggle && <Icon className="text-secondary" />}
    </Tag>
  );
};
