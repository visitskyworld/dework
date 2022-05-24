import React, { CSSProperties, FC, useMemo } from "react";
import { Subtask } from "@dewo/app/graphql/types";
import { List } from "antd";
import { SubtaskListItem } from "../list/SubtaskListItem";
import _ from "lodash";

interface Props {
  subtasks: Subtask[];
  style?: CSSProperties;
  showBranches?: boolean;
}

export const SubtaskList: FC<Props> = ({ subtasks, style, showBranches }) => (
  <List
    style={style}
    dataSource={useMemo(() => _.sortBy(subtasks, "sortKey"), [subtasks])}
    renderItem={(subtask, index) => (
      <SubtaskListItem
        key={subtask.id}
        task={subtask}
        last={subtasks.length === index + 1}
        showBranches={showBranches}
      />
    )}
  />
);
