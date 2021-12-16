import React, { FC } from "react";
import { useUploadImage } from "../fileUploads/hooks";

interface Props {}

export const UploadUserAvatarButton: FC<Props> = () => {
  const uploadImage = useUploadImage();
  return null;
};
