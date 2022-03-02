import { Dropdown, InputNumber, Menu } from "antd";
import React, { FC, useCallback } from "react";

interface Props {
  disabled?: boolean;
  value?: number;
  onChange?(value: number | undefined): void;
}

export const StoryPointsInput: FC<Props> = ({ disabled, value, onChange }) => (
  <Dropdown
    disabled={disabled}
    trigger={["click"]}
    overlay={
      <Menu>
        <div style={{ maxHeight: 264, overflowY: "auto" }}>
          {[1, 2, 3, 5, 8].map((storyPoints) => (
            <Menu.Item
              key={storyPoints}
              children={storyPoints}
              className={
                value === storyPoints
                  ? "ant-select-item-option-selected"
                  : undefined
              }
              onClick={() => onChange?.(storyPoints)}
            />
          ))}
        </div>
      </Menu>
    }
  >
    <InputNumber
      min={0}
      style={{ width: "100%" }}
      placeholder="Estimate task size in hours"
      value={value}
      onChange={useCallback(
        (value) =>
          onChange?.(typeof value === "number" ? Math.ceil(value) : undefined),
        [onChange]
      )}
    />
  </Dropdown>
);
