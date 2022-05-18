import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { FilterIcon } from "@dewo/app/components/icons/Filter";
import { SortIcon } from "@dewo/app/components/icons/Sort";
import { Button, InputRef, Row } from "antd";
import styles from "./TaskViewTabs.module.less";
import { DebouncedInput } from "@dewo/app/components/DebouncedInput";
import { useTaskViewContext } from "./TaskViewContext";
import classNames from "classnames";

interface Props {
  className?: string;
}

export const TaskViewToolbar: FC<Props> = ({ className }) => {
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

  const input = useRef<InputRef>(null);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "f3" || ((e.ctrlKey || e.metaKey) && e.key === "f")) {
        if (!!input.current) {
          e.preventDefault();
          input.current.focus();
        }
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <Row align="middle" className={classNames(className, styles.toolbar)}>
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
        ref={input}
        value={searchQuery}
        placeholder="Search tasks..."
        style={{
          flex: 1,
          maxWidth: 200,
          minWidth: 120,
        }}
        onChange={handleChange}
      />
    </Row>
  );
};
