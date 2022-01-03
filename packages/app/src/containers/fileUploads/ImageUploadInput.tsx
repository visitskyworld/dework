import React, {
  Children,
  cloneElement,
  CSSProperties,
  FC,
  isValidElement,
  useCallback,
  useState,
} from "react";
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
  const [loading, setLoading] = useState(false);
  const uploadImage = useUploadFile();
  const handleSelectImage = useCallback(
    async ([image]: [File]) => {
      try {
        setLoading(true);
        const imageUrl = await uploadImage(image);
        await onChange?.(imageUrl);
      } finally {
        setLoading(false);
      }
    },
    [uploadImage, onChange]
  );

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { loading });
    }
    return child;
  });

  return (
    <FilePicker accept="image/*" style={style} onSelect={handleSelectImage}>
      {childrenWithProps}
    </FilePicker>
  );
};
