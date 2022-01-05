import React, { FC, useCallback } from "react";
import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import { useUpdateUser } from "./hooks";
import { ImageUploadInput } from "../fileUploads/ImageUploadInput";

export const EditUserAvatarButton: FC = () => {
  const updateUser = useUpdateUser();
  const handleSelectImage = useCallback(
    (imageUrl: string) => updateUser({ imageUrl }),
    [updateUser]
  );

  return (
    <ImageUploadInput
      style={{ position: "absolute", bottom: 0, right: 0 }}
      onChange={handleSelectImage}
    >
      <Button
        icon={<Icons.EditOutlined />}
        shape="circle"
        className="bg-body"
        type="primary"
      />
    </ImageUploadInput>
  );
};
