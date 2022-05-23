import React, { CSSProperties, FC } from "react";
import { Subtask } from "@dewo/app/graphql/types";
import { List } from "antd";
import { SubtaskListItem } from "../list/SubtaskListItem";

interface Props {
  subtasks: Subtask[];
  style?: CSSProperties;
  showBranches?: boolean;
}

export const SubtaskList: FC<Props> = ({ subtasks, style, showBranches }) => (
  <List
    style={style}
    dataSource={subtasks}
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
