import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Input, InputProps } from "antd";
import _ from "lodash";

export const DebouncedInput: FC<InputProps & { debounce?: number }> = ({
  debounce = 300,
  onChange,
  value,
  ...props
}) => {
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

  return <Input {...props} value={currentVal} onChange={handleChange} />;
};
