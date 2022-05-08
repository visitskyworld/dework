import React, { ChangeEventHandler, FC, useCallback } from "react";
import { FilterIcon } from "@dewo/app/components/icons/Filter";
import { SortIcon } from "@dewo/app/components/icons/Sort";
import { Button, Row } from "antd";
import styles from "./TaskViewTabs.module.less";
import { DebouncedInput } from "@dewo/app/components/DebouncedInput";
import { useTaskViewContext } from "./TaskViewContext";

interface Props {}

export const TaskViewToolbar: FC<Props> = ({}) => {
  const { searchQuery, onSearchQueryChange } = useTaskViewContext();
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => onSearchQueryChange(e.target.value),
    [onSearchQueryChange]
  );
  const forcefullyShowTaskViewPopover = useCallback(() => {
    const maybeButton = document.querySelector(
      '.ant-tabs-tab-active > div[role="tab"] > button'
    ) as HTMLButtonElement | undefined;
    maybeButton?.click();
  }, []);
  return (
    <Row align="middle" className={styles.toolbar}>
      <Button
        size="small"
        icon={<SortIcon />}
        type="text"
        onClick={forcefullyShowTaskViewPopover}
        className="text-secondary"
      >
        Sort
      </Button>
      <Button
        size="small"
        icon={<FilterIcon />}
        type="text"
        onClick={forcefullyShowTaskViewPopover}
        className="text-secondary"
      >
        Filter
      </Button>
      <DebouncedInput
        value={searchQuery}
        placeholder="Search tasks..."
        style={{ flex: 1, maxWidth: 200 }}
        onChange={handleChange}
      />
    </Row>
  );
};
