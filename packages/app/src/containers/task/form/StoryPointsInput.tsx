import { InputNumber } from "antd";
import React, { FC, useCallback } from "react";

interface Props {
  disabled?: boolean;
  value?: number;
  onChange?(value: number | null): void;
}

export const StoryPointsInput: FC<Props> = ({ disabled, value, onChange }) => (
  <InputNumber
    disabled={disabled}
    min={0}
    style={{ width: "100%" }}
    placeholder="Estimate task effort"
    value={value}
    onChange={useCallback(
      (value) => onChange?.(typeof value === "number" ? value : null),
      [onChange]
    )}
  />
);
