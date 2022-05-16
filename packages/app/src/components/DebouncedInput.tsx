import React, {
  ChangeEventHandler,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Input, InputProps, InputRef } from "antd";
import _ from "lodash";

interface Props extends InputProps {
  debounce?: number;
}

export const DebouncedInput = forwardRef<InputRef, Props>(
  ({ debounce = 300, onChange, value, ...props }, ref) => {
    const debouncedUpdate = useMemo(
      () => (onChange ? _.debounce(onChange, debounce) : () => {}),
      [debounce, onChange]
    );
    const [currentVal, setValue] = useState(value);
    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        setValue(e.target.value);
        debouncedUpdate(e);
      },
      [debouncedUpdate]
    );

    return (
      <Input ref={ref} {...props} value={currentVal} onChange={handleChange} />
    );
  }
);
