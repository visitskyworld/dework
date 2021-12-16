import React, {
  FC,
  ReactNode,
  ChangeEventHandler,
  useCallback,
  useRef,
  CSSProperties,
} from "react";

interface Props {
  children: ReactNode;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  onSelect?(files: File[]): void;
}

export const FilePicker: FC<Props> = ({
  children,
  multiple,
  accept,
  disabled,
  style,
  className = "",
  onSelect,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const openPicker = useCallback(() => {
    // Note(fant): we reset the value of the input so that it's possible to upload
    // the same file multiple times in a row (eg when sending it in multiple messages).
    // https://stackoverflow.com/a/20552042
    if (!!inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }, []);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const files = Array.from(event.target.files || []);
      onSelect?.(files);
    },
    [onSelect]
  );

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        multiple={multiple}
        accept={accept}
        ref={inputRef}
        onChange={handleChange}
      />
      <div
        onClick={disabled ? undefined : openPicker}
        style={style}
        className={className}
      >
        {children}
      </div>
    </>
  );
};
