import { Dropdown, Menu } from "antd";
import React, { ReactNode, useCallback } from "react";

interface DropdownSelectOption {
  value: string;
  label: ReactNode;
}

interface DropdownSelectProps<T = string | string[]> {
  value?: T;
  mode: T extends string ? "default" : "multiple";
  children: ReactNode;
  options?: DropdownSelectOption[];
  onChange?(value: T): void;
}

export function DropdownSelect<T extends string | string[]>({
  value,
  mode,
  options,
  children,
  onChange,
}: DropdownSelectProps<T>) {
  const isSelected = useCallback(
    (v: string) => {
      if (mode === "default") return value === v;
      return !!value?.includes(v);
    },
    [value, mode]
  );

  const handleSelect = useCallback(
    (v: string) => {
      if (mode === "default") {
        onChange?.(v as T);
      } else {
        const array = value as string[] | undefined;
        if (!!array?.includes(v)) {
          onChange?.((array?.filter((x) => x !== v) as T) ?? []);
        } else {
          onChange?.([...(array ?? []), v] as T);
        }
      }
    },
    [value, mode, onChange]
  );

  return (
    <Dropdown
      placement="bottomRight"
      trigger={["click"]}
      overlay={
        <Menu>
          {options?.map((option) => (
            <Menu.Item
              key={option.value}
              className={
                isSelected(option.value)
                  ? "ant-select-item-option-selected"
                  : undefined
              }
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Menu.Item>
          ))}
        </Menu>
      }
      children={children}
    />
  );
}
