import { Space, Tag, Tooltip } from "antd";
import React, { FC } from "react";
import { TaskQuickFilter } from "./FilterContext";
import * as Icons from "@ant-design/icons";

interface Props {
  value?: TaskQuickFilter;
  onChange?(value: TaskQuickFilter | undefined): void;
}

const quickFilters: Record<
  TaskQuickFilter,
  { label: string; description: string }
> = {
  [TaskQuickFilter.ASSIGNED_REVIEWING_CLAIMABLE]: {
    label: "Assigned, reviewing or claimable tasks",
    description: "Show tasks you can claim, are assigned to or are reviewing",
  },
};

export const TaskQuickFilterField: FC<Props> = ({ value, onChange }) => {
  return (
    <>
      <Space direction="vertical">
        {Object.entries(quickFilters).map(([type, quickFilter]) => {
          const selected = value === type;
          return (
            <Tooltip title={quickFilter.description}>
              <Tag
                color={type === value ? "green" : undefined}
                style={{ padding: "4px 12px", cursor: "pointer" }}
                className={selected ? undefined : "hover:component-highlight"}
                onClick={() =>
                  onChange?.(selected ? undefined : (type as TaskQuickFilter))
                }
              >
                {quickFilter.label}
                {"  "}
                <Icons.QuestionCircleOutlined />
              </Tag>
            </Tooltip>
          );
        })}
      </Space>
    </>
  );
};
