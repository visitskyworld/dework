import React, { FC, useCallback, useState } from "react";
import { Button } from "antd";
import * as Icons from "@ant-design/icons";
import { useUploadImage } from "../fileUploads/hooks";
import { useUpdateUser } from "./hooks";
import { FilePicker } from "@dewo/app/components/FilePicker";

export const EditUserAvatarButton: FC = () => {
  const [loading, setLoading] = useState(false);
  const uploadImage = useUploadImage();
  const updateUser = useUpdateUser();
  const handleSelectImage = useCallback(
    async ([image]: [File]) => {
      try {
        setLoading(true);
        const imageUrl = await uploadImage(image);
        await updateUser({ imageUrl });
      } finally {
        setLoading(false);
      }
    },
    [uploadImage, updateUser]
  );

  return (
    <FilePicker
      accept="image/*"
      style={{ position: "absolute", bottom: 0, right: 0 }}
      onSelect={handleSelectImage}
    >
      <Button
        loading={loading}
        icon={<Icons.EditOutlined />}
        shape="circle"
        className="bg-body"
        type="primary"
      />
    </FilePicker>
  );
};
