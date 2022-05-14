import { Dropdown, DropDownProps, Input, Menu } from "antd";
import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { eatClick, stopPropagation } from "../util/eatClick";

export interface DropdownSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  data?: string;
}

interface DropdownSelectProps<T = string | string[]> {
  value?: T;
  mode: T extends string ? "default" : "multiple";
  placement?: DropDownProps["placement"];
  disabled?: boolean;
  children: ReactNode;
  options?: DropdownSelectOption[];
  onChange?(value: T): void;
  showSearch?: boolean;
  menuStyle?: CSSProperties;
}

export function DropdownSelect<T extends string | string[]>({
  value,
  mode,
  options,
  disabled,
  placement,
  children,
  onChange,
  menuStyle,
  showSearch = false,
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

  const [filter, setFilter] = useState("");

  const filteredOptions = useMemo(() => {
    if (!options) return [];
    if (!filter) return options;

    const lowerCasedFilter = filter.toLowerCase();
    return options.filter(({ data }) =>
      data?.toLowerCase()?.includes(lowerCasedFilter)
    );
  }, [filter, options]);

  return (
    <Dropdown
      destroyPopupOnHide
      placement={placement}
      disabled={disabled}
      trigger={["click"]}
      // @ts-ignore
      onClick={eatClick}
      overlay={
        <Menu onClick={(e) => stopPropagation(e.domEvent)} style={menuStyle}>
          {showSearch && (
            <Menu.Item>
              <Input
                autoFocus
                value={filter}
                onChange={(e) => setFilter(e.currentTarget.value)}
                onClick={stopPropagation}
                placeholder="Search username..."
              />
            </Menu.Item>
          )}
          <div style={{ maxHeight: 264, overflowY: "auto" }}>
            {filteredOptions.map((option) => (
              <Menu.Item
                key={option.value}
                disabled={option.disabled}
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
          </div>
        </Menu>
      }
      children={children}
    />
  );
}
