import React, { CSSProperties, FC, useCallback } from "react";
import { useUploadFile } from "./hooks";
import { FilePicker } from "@dewo/app/components/FilePicker";

interface FileUploadInputProps {
  style?: CSSProperties;
  onChange?(value: string): void;
}

export const ImageUploadInput: FC<FileUploadInputProps> = ({
  children,
  style,
  onChange,
}) => {
  const uploadImage = useUploadFile();
  const handleSelectImage = useCallback(
    async ([image]: [File]) => {
      try {
        const imageUrl = await uploadImage(image);
        await onChange?.(imageUrl);
      } catch {}
    },
    [uploadImage, onChange]
  );

  return (
    <FilePicker accept="image/*" style={style} onSelect={handleSelectImage}>
      {children}
    </FilePicker>
  );
};
